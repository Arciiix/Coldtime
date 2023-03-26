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
} from "@chakra-ui/react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import deviceListState from "@renderer/state/devices/deviceList";
const { ipcRenderer } = window.require("electron");
import { useRecoilState } from "recoil";

export default function AddDevice() {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [allDevices, setAllDevices] = useRecoilState(deviceListState);

  const onSubmit = async (data) => {
    setSubmitting(true);

    console.log("saving...");
    const { newDevice, devices } = await ipcRenderer.invoke("ADD_DEVICE", data);

    setAllDevices(devices);
    navigate(`/device/${newDevice.id}`);

    setSubmitting(false);
  };

  return (
    <div className="m-2">
      <span className="text-2xl">{t("device.addNewDevice")}</span>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor="name">{t("addForm.fields.name")}</FormLabel>
          <Input
            id="name"
            type="text"
            {...register("name", { required: true })}
            disabled={submitting}
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
            disabled={submitting}
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
            defaultValue={56000}
            {...register("port", {
              valueAsNumber: true,
              required: true,
              min: { value: 1, message: t("addForm.errors.port") },
              max: {
                value: 65535,
                message: t("addForm.errors.port"),
              },
            })}
            disabled={submitting}
          />
          {errors.port && (
            <FormErrorMessage>
              <MdErrorOutline /> {t("addForm.errors.port")}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.user}>
          <FormLabel htmlFor="user">{t("addForm.fields.user")}</FormLabel>
          <Input
            id="user"
            type="text"
            defaultValue={"admin"}
            {...register("user")}
            disabled={submitting}
          />
          {errors.user && (
            <FormErrorMessage>
              <MdErrorOutline /> {t("addForm.errors.user")}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password">
            {t("addForm.fields.password")}
          </FormLabel>
          <Input
            id="password"
            type="password"
            // TODO: Add show icon
            {...register("password")}
            disabled={submitting}
          />
          {errors.password && (
            <FormErrorMessage>
              <MdErrorOutline /> {t("addForm.errors.password")}
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
            leftIcon={
              submitting ? <IoIosCheckmarkCircleOutline size="1.2em" /> : <></>
            }
          >
            {t("addForm.submit")}
          </Button>
        </Flex>
      </form>
    </div>
  );
}
