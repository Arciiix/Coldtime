import { Divider } from "@chakra-ui/react";
import deviceListState from "@renderer/state/devices/deviceList";
import { IDevice } from "@renderer/types/device";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import DeviceList from "../devices/DeviceList/DeviceList";
import NetworkDiscovery from "../NetworkDiscovery/NetworkDiscovery";
const { ipcRenderer } = window.require("electron");

export default function Home() {
  const { t } = useTranslation();
  const [deviceList, setDeviceList] = useRecoilState(deviceListState);

  const [isLoading, setIsLoading] = useState(true);

  const fetchDevices = async () => {
    const { devices } = await ipcRenderer.invoke("GET_DEVICES");
    setDeviceList((devices || []) satisfies IDevice[]);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  if (isLoading) return <h1>loading</h1>; /* TODO */
  return (
    <div className="flex flex-col m-2 select-none gap-4">
      <span className="text-3xl">{t("deviceList")}</span>
      <DeviceList devices={deviceList} />
      <Divider />
      <NetworkDiscovery />
    </div>
  );
}
