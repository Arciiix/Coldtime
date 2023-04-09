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
    ipcRenderer.on("NAVIGATE_TO_DEVICE", (_, deviceId: string) => {
      console.log("Navigate to device");
      navigate(`/device/${deviceId}`);
    });

    ipcRenderer.on(
      "REFRESH_DATA",
      (_, { id, data }: { id: string; data: IDeviceState }) => {
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
      }
    );
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
