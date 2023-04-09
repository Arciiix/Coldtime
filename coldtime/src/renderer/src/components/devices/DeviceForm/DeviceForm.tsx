import { useTranslation } from "react-i18next";

import { useForm } from "react-hook-form";
import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  Flex,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import deviceListState from "@renderer/state/devices/deviceList";
const { ipcRenderer } = window.require("electron");
import { useRecoilState } from "recoil";
import NetworkDiscovery from "@renderer/components/NetworkDiscovery/NetworkDiscovery";
import { DEFAULT_PORT, IDevice } from "@renderer/types/device";

interface IDeviceFormProps {
  editedDevice?: IDevice | null;
  hideTitle?: boolean;
}
export default function DeviceForm({
  editedDevice,
  hideTitle,
}: IDeviceFormProps) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: editedDevice?.name ?? "",
      ip: editedDevice?.ip ?? "",
      port: editedDevice?.port ?? DEFAULT_PORT,
    },
  });
  const navigate = useNavigate();
  const [allDevices, setAllDevices] = useRecoilState(deviceListState);

  const onSubmit = async (data) => {
    setSubmitting(true);

    console.log("saving...");
    const { newDevice, devices } = await ipcRenderer.invoke(
      editedDevice ? "EDIT_DEVICE" : "ADD_DEVICE",
      editedDevice ? { ...data, id: editedDevice.id } : data
    );

    setAllDevices(devices);
    navigate(`/device/${newDevice.id}`);

    setSubmitting(false);
  };
  console.log(allDevices);

  return (
    <div className="m-2 flex flex-col">
      {!hideTitle ? (
        !editedDevice ? (
          <>
            <Text fontSize="4xl">{t("device.addNewDevice.title")}</Text>
            <Text fontSize="2xl" color="blue.300">
              {t("device.addNewDevice.auto")}
            </Text>
            <Text fontSize="sm" color="blue.200">
              {t("device.addNewDevice.autoDesc")}
            </Text>
            <NetworkDiscovery />
            <Text fontSize="2xl" color="yellow.300">
              {t("device.addNewDevice.orManual")}
            </Text>
            <Text fontSize="sm" color="yellow.200">
              {t("device.addNewDevice.manualDesc")}
            </Text>
          </>
        ) : (
          <Text fontSize="4xl">{t("device.editDevice.title")}</Text>
        )
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">{t("addForm.fields.name")}</FormLabel>
          <Input
            id="name"
            type="text"
            {...register("name", { required: true })}
            isDisabled={submitting}
          />
          {errors.name && (
            <FormErrorMessage>
              <MdErrorOutline /> {t("addForm.errors.name")}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.ip}>
          <FormLabel htmlFor="ip">{t("addForm.fields.ip")}</FormLabel>
          <Input
            id="ip"
            type="text"
            {...register("ip", {
              required: true,
              pattern: {
                value: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
                message: t("addForm.errors.ip"),
              },
            })}
            isDisabled={submitting}
          />
          {errors.ip && (
            <FormErrorMessage>
              <MdErrorOutline /> {t("addForm.errors.ip")}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.port}>
          <FormLabel htmlFor="port">{t("addForm.fields.port")}</FormLabel>
          <Input
            id="port"
            type="number"
            defaultValue={DEFAULT_PORT}
            {...register("port", {
              valueAsNumber: true,
              required: true,
              min: { value: 1, message: t("addForm.errors.port") },
              max: {
                value: 65535,
                message: t("addForm.errors.port"),
              },
            })}
            isDisabled={submitting}
          />
          {errors.port && (
            <FormErrorMessage>
              <MdErrorOutline /> {t("addForm.errors.port")}
            </FormErrorMessage>
          )}
        </FormControl>

        <Flex mt={4}>
          <Spacer />
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={submitting}
            isDisabled={submitting}
            leftIcon={<IoIosCheckmarkCircleOutline size="1.2em" />}
          >
            {editedDevice ? t("save") : t("addForm.submit")}
          </Button>
        </Flex>
      </form>
    </div>
  );
}
