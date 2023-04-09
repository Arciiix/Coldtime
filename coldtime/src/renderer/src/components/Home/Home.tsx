import { Box, Text } from "@chakra-ui/react";
import getSettings from "@renderer/fetch/settings/getSettings";
import deviceListState from "@renderer/state/devices/deviceList";
import settingsState from "@renderer/state/settings/settings";
import { IDevice } from "@renderer/types/device";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import DeviceList from "../devices/DeviceList/DeviceList";

const { ipcRenderer } = window.require("electron");

export default function Home() {
  const navigate = useNavigate();

  const [_, setSettings] = useRecoilState(settingsState);

  const { t } = useTranslation();
  const [deviceList, setDeviceList] = useRecoilState(deviceListState);

  const [isLoading, setIsLoading] = useState(true);

  const fetchDevices = async () => {
    const { devices } = await ipcRenderer.invoke("GET_DEVICES", {
      withState: true,
    });
    setDeviceList((devices || []) satisfies IDevice[]);

    setIsLoading(false);
  };

  const fetchOnInit = async () => {
    const settings = await getSettings();
    setSettings(settings);
    if (settings.language.isDefault) {
      // Ran the app for the first time; navigate to init
      navigate("/init");
    }
  };

  useEffect(() => {
    fetchOnInit().then((_) => {
      fetchDevices();
    });
  }, []);

  if (isLoading) return <h1>loading</h1>; /* TODO */
  return (
    <Box
      display="flex"
      flexDirection="column"
      m={2}
      userSelect="none"
      gridGap={4}
    >
      <Text fontSize="4xl" fontWeight="bold" mb="4">
        {t("deviceList")}
      </Text>
      <DeviceList devices={deviceList} />
    </Box>
  );
}
