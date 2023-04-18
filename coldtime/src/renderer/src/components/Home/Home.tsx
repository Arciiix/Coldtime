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
      h="100vh"
      bgImage="radial-gradient(at 47% 33%, hsl(233.85, 59%, 13%) 0, transparent 59%), 
      radial-gradient(at 82% 65%, hsl(163.33, 40%, 9%) 0, transparent 55%),
      radial-gradient(at 22% 55%, hsl(163.33, 20%, 9%) 0, transparent 40%),
      radial-gradient(at 40% 80%, hsl(332, 58%, 13%) 0, transparent 40%);"
    >
      <Box
        display="flex"
        flexDirection="column"
        p={4}
        userSelect="none"
        gridGap={4}
        overflowY="auto"
        h={"100%"}
      >
        <Text fontSize="4xl" fontWeight="bold" mb="4">
          {t("deviceList.title")}
        </Text>
        <DeviceList devices={deviceList} />
      </Box>
    </Box>
  );
}
