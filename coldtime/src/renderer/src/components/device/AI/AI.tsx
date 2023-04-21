import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Loading from "@renderer/components/UI/Loading/Loading";
import { AIReturnType, IDevice, IDeviceStateRaw } from "@renderer/types/device";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaBrain } from "react-icons/fa";
import { MdOutlineScience } from "react-icons/md";
import DataDisplay from "../DataDisplay";

const { ipcRenderer } = window.require("electron");

interface IAIProps {
  deviceId: string;
  lowerSize: boolean;
  deviceData: IDevice;
}

export default function AI({ deviceId, lowerSize, deviceData }: IAIProps) {
  const { t } = useTranslation();

  const {
    register,
    formState: { errors, isValid },
    watch,
  } = useForm({ mode: "onChange" });

  const numberOfEpochs = watch("epochs");
  const pointsToGenerate = watch("pointsToGenerate");

  const [isShowingModal, setIsShowingModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIReturnType>({
    predictions: [],
    lastPoints: [],
  });

  const showModal = () => setIsShowingModal(true);
  const hideModal = () => setIsShowingModal(false);

  const handlePredictData = async () => {
    if (!isValid) return;
    setIsLoading(true);

    const predictions = await ipcRenderer.invoke(
      "PREDICT_DATA",
      deviceId,
      Math.floor(numberOfEpochs),
      Math.floor(pointsToGenerate)
    );

    setResult(predictions satisfies IDeviceStateRaw[]);
    setIsLoading(false);
  };

  useEffect(() => {
    setResult({
      predictions: [],
      lastPoints: [],
    });
  }, [isShowingModal]);

  return (
    <>
      <Modal onClose={hideModal} size={"full"} isOpen={isShowingModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg="linear-gradient(to right, #ff0000, #9932cc)"
            backgroundClip={"text"}
            fontSize={32}
          >
            {t("device.ai.predict")}
            <Badge
              display="flex"
              justifyContent="center"
              alignItems="center"
              color="silver"
              w="max-content"
              my={3}
              rounded="md"
            >
              {" "}
              <MdOutlineScience size={24} />
              {t("device.ai.experimental").toUpperCase()}
            </Badge>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody display="flex" flexDir="column" gap={2}>
            <FormControl isInvalid={!!errors.epochs}>
              <FormLabel fontSize={21}>{t("device.ai.epochs")}</FormLabel>

              <Input
                type="number"
                min={1}
                {...register("epochs", {
                  value: 100,
                  min: {
                    value: 1,
                    message: t("device.ai.epochsError"),
                  },
                  required: {
                    value: true,
                    message: t("device.ai.epochsError"),
                  },
                })}
              />
              <FormErrorMessage>
                {errors?.epochs?.message?.toString() ?? ""}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.pointsToGenerate}>
              <FormLabel fontSize={21}>
                {t("device.ai.pointsToGenerate")}
              </FormLabel>

              <Input
                type="number"
                min={1}
                {...register("pointsToGenerate", {
                  value: 5,
                  min: {
                    value: 1,
                    message: t("device.ai.pointsToGenerateError"),
                  },
                  required: {
                    value: true,
                    message: t("device.ai.pointsToGenerateError"),
                  },
                })}
              />
              <FormErrorMessage>
                {errors?.pointsToGenerate?.message?.toString() ?? ""}
              </FormErrorMessage>
            </FormControl>

            <Button
              onClick={handlePredictData}
              disabled={isLoading || !isValid}
              isLoading={isLoading}
              my={2}
              colorScheme="purple"
              variant="ghost"
            >
              {t("device.ai.train")}
            </Button>

            <Loading
              isLoading={isLoading}
              description={t("device.ai.predicting").toString()}
            />

            <DataDisplay
              historicalDataRefreshTime={new Date()}
              historicalData={[]}
              lowerSize={lowerSize}
              deviceData={deviceData}
              canRefresh={false}
              handleRefresh={() => null}
              isRefreshing={false}
              aiData={result}
              hideLegend
              hideExport
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Box p={3} m={2}>
        <Box
          marginX={"auto"}
          display="flex"
          w="max-content"
          p={3}
          alignItems="center"
          justifyContent="center"
          gap={3}
          flexShrink="0"
          rounded="xl"
          bgGradient="linear-gradient(to right, #f5ce62, #e43603, #fa7199, #e85a19)"
          bgSize="300% 100%"
          boxShadow="0 4px 15px 0 rgba(229, 66, 10, 0.75)"
          transition="all 0.3s ease-out"
          _hover={{
            backgroundPosition: "100% 0%",
            cursor: "pointer",
          }}
          onClick={showModal}
        >
          <FaBrain fontSize={28} />
          {t("device.ai.predict")}
        </Box>
        <Flex justifyContent="center" alignItems="center" color="silver" my={2}>
          <MdOutlineScience size={24} />
          {t("device.ai.experimental")}
        </Flex>
      </Box>
    </>
  );
}
