import { Button, SkeletonText } from "@chakra-ui/react";
import networkDiscoveryState from "@renderer/state/network/networkDiscovery";
import { INetworkDiscoveryDevice } from "@renderer/types/networkDiscoveryDevice";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";

const { ipcRenderer } = window.require("electron");

export default function NetworkDiscovery() {
  const { t } = useTranslation();

  const [networkDiscovery, setNetworkDiscovery] = useRecoilState(
    networkDiscoveryState
  );
  const numberOfDevicesCompatible = useMemo(() => {
    if (
      !networkDiscovery ||
      !networkDiscovery.some((e) => e.data !== undefined)
    )
      return null;
    console.log(networkDiscovery);
    return networkDiscovery.filter((e) => e.data).length;
  }, [networkDiscovery]);

  const autoDiscovery = async () => {
    setNetworkDiscovery(null);

    let { devices } = await ipcRenderer.invoke("NETWORK_DISCOVERY");

    console.log(devices);

    setNetworkDiscovery(devices);

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
  };

  return (
    <>
      <Button
        variant="ghost"
        colorScheme={"blue"}
        isLoading={networkDiscovery === null}
        isDisabled={networkDiscovery === null}
        onClick={autoDiscovery}
      >
        {t("networkDiscovery.title")}
      </Button>
      {networkDiscovery ? (
        <>
          {" "}
          <span>
            {t("networkDiscovery.found", { count: networkDiscovery.length })}
          </span>
          {numberOfDevicesCompatible !== null ? (
            <span>
              {t("networkDiscovery.compatible", {
                count: numberOfDevicesCompatible,
              })}
            </span>
          ) : (
            <SkeletonText />
          )}
          {/* TODO: DEV */}
          {networkDiscovery.map((e) => {
            return (
              <span>
                IP: {e.ip}; {(!!e.data).toString()}
              </span>
            );
          })}
        </>
      ) : null}
    </>
  );
}
