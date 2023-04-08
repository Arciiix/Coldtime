import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Skeleton,
  SkeletonText,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
} from "@chakra-ui/react";
import deviceListState from "@renderer/state/devices/deviceList";
import networkDiscoveryState from "@renderer/state/network/networkDiscovery";
import { DEFAULT_PORT, IDevice } from "@renderer/types/device";
import { INetworkDiscoveryDevice } from "@renderer/types/networkDiscoveryDevice";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PacmanLoader } from "react-spinners";
import { useRecoilState } from "recoil";
import DeviceCard from "../devices/Device/DeviceCard";
import Loading from "../UI/Loading";

const { ipcRenderer } = window.require("electron");

export default function NetworkDiscovery() {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });

  const navigate = useNavigate();

  const [networkDiscovery, setNetworkDiscovery] = useRecoilState(
    networkDiscoveryState
  );
  const [isNetworkDiscoveryLoading, setIsNetworkDiscoveryLoading] =
    useState(false);
  const [
    networkDiscoveryDeviceAddingInfo,
    setNetworkDiscoveryDeviceAddingInfo,
  ] = useState<INetworkDiscoveryDevice | null>(null);

  const [allDevices, setAllDevices] = useRecoilState(deviceListState);

  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const compatibleDevices: INetworkDiscoveryDevice[] = useMemo(() => {
    if (
      !networkDiscovery ||
      !networkDiscovery.some((e) => e.data !== undefined)
    )
      return [];

    console.log(networkDiscovery, allDevices);

    return (
      networkDiscovery.filter(
        (e) => e.data && !allDevices.find((elem) => e.ip === elem.ip)
      ) || []
    );
  }, [networkDiscovery]);

  const autoDiscovery = async () => {
    setNetworkDiscovery(null);

    let { devices } = await ipcRenderer.invoke("NETWORK_DISCOVERY");

    console.log(devices);

    setNetworkDiscovery(devices);
    setIsNetworkDiscoveryLoading(true);

    const promises = devices.map((e: INetworkDiscoveryDevice) => {
      return ipcRenderer.invoke("GET_DEVICE_DATA_BY_IP", e.ip);
    });

    const result = await Promise.all(promises);
    const newDevices = devices.map((e, i) => ({
      ...e,
      data: result[i],
    })) satisfies INetworkDiscoveryDevice[];
    console.log("new", newDevices);
    setNetworkDiscovery(newDevices);
    setIsNetworkDiscoveryLoading(false);
  };

  const onNetworkDiscoveryDeviceAddClose = () => {
    setNetworkDiscoveryDeviceAddingInfo(null);
    setValue("name", "");
  };
  const onNetworkDiscoveryDeviceAdd = (device: INetworkDiscoveryDevice) => {
    setValue("name", device.mac);

    setNetworkDiscoveryDeviceAddingInfo(device);
  };

  const addDevice = async ({ name }) => {
    if (isNetworkDiscoveryLoading || !networkDiscoveryDeviceAddingInfo || !name)
      return;
    setIsNetworkDiscoveryLoading(true);

    const data = {
      ip: networkDiscoveryDeviceAddingInfo.ip,
      name: name,
      port: DEFAULT_PORT,
    };

    const { newDevice, devices } = await ipcRenderer.invoke("ADD_DEVICE", data);

    setAllDevices(devices);
    setIsNetworkDiscoveryLoading(false);
    setNetworkDiscoveryDeviceAddingInfo(null);
    setValue("name", "");
    navigate(`/device/${newDevice.id}`);
  };

  useEffect(() => {
    autoDiscovery();
  }, []);

  return (
    <>
      <AlertDialog
        isOpen={!!networkDiscoveryDeviceAddingInfo}
        leastDestructiveRef={cancelRef}
        onClose={onNetworkDiscoveryDeviceAddClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent p={3}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("device.addNewDevice.networkDiscovery.nameForm.title")}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t("device.addNewDevice.networkDiscovery.nameForm.description", {
                ip: networkDiscoveryDeviceAddingInfo?.ip ?? "?",
              })}

              <FormControl isInvalid={!!errors.name} my={3}>
                <FormLabel>{t("addForm.fields.name")}</FormLabel>
                <Input {...register("name", { required: true })} />
                <FormErrorMessage>
                  {errors?.name ? t("addForm.errors.name") : ""}
                </FormErrorMessage>
              </FormControl>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={(r) => (cancelRef.current = r)}
                onClick={onNetworkDiscoveryDeviceAddClose}
              >
                {t("cancel")}
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit(addDevice)}
                ml={3}
              >
                {t("save")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {networkDiscovery ? (
        <>
          <Flex gap={3} justifyContent="space-between">
            <Stat>
              <StatLabel>
                {t("device.addNewDevice.networkDiscovery.found")}
              </StatLabel>
              <StatNumber>{networkDiscovery.length}</StatNumber>
            </Stat>
            {!isNetworkDiscoveryLoading ? (
              <Stat>
                <StatLabel>
                  {t("device.addNewDevice.networkDiscovery.compatible")}
                </StatLabel>
                <StatNumber>{compatibleDevices.length}</StatNumber>
                <StatHelpText>
                  {t("device.addNewDevice.networkDiscovery.excludingAdded")}
                </StatHelpText>
              </Stat>
            ) : (
              <>
                <Loading isLoading loaderProps={{ size: 10 }} />
              </>
            )}
          </Flex>
          {!isNetworkDiscoveryLoading ? (
            compatibleDevices.map((e) => {
              return (
                <Box
                  m={3}
                  w={"max-content"}
                  onClick={() => onNetworkDiscoveryDeviceAdd(e)}
                >
                  <DeviceCard
                    overrideLink={""}
                    device={{
                      id: "",
                      ip: e.ip,
                      name: e.mac,
                      lastState: e.data || null,
                      port: DEFAULT_PORT,
                    }}
                  />
                </Box>
              );
            })
          ) : (
            <Skeleton width={250} height={200} />
          )}
        </>
      ) : (
        <SkeletonText />
      )}
    </>
  );
}
