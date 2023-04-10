import deviceListState from "@renderer/state/devices/deviceList";
import { IDeviceState } from "@renderer/types/device";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

const { ipcRenderer } = window.require("electron");

export default function GlobalWrapper() {
  const navigate = useNavigate();
  const [allDevices, setAllDevices] = useRecoilState(deviceListState);

  useEffect(() => {
    const onDataRefresh = (
      _,
      { id, data }: { id: string; data: IDeviceState }
    ) => {
      console.log("Refresh data");
      setAllDevices((prev) => {
        return prev.map((e) =>
          e.id === id
            ? {
                ...e,
                lastState: data,
              }
            : e
        );
      });
    };

    const navigateToDevice = (_, deviceId: string) => {
      console.log("Navigate to device");
      navigate(`/device/${deviceId}`);
    };

    ipcRenderer.on("NAVIGATE_TO_DEVICE", navigateToDevice);

    ipcRenderer.on("REFRESH_DATA", onDataRefresh);

    return () => {
      ipcRenderer.removeListener("REFRESH_DATA", onDataRefresh);
      ipcRenderer.removeListener("NAVIGATE_TO_DEVICE", navigateToDevice);
    };
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
