import { SimpleGrid } from "@chakra-ui/react";
import { IDevice } from "@renderer/types/device";
import { useMemo } from "react";
import Device from "../Device/Device";
import DeviceCard from "../Device/DeviceCard";
import NewDevice from "./NewDevice";

interface IDeviceListProps {
  devices: IDevice[];
}

export default function DeviceList(props: IDeviceListProps) {
  const devices = useMemo(
    () =>
      props.devices.map((e) => {
        // return <Device {...e} />;
        return <DeviceCard device={e} />;
      }),
    [props.devices]
  );

  return (
    <SimpleGrid
      spacing={"30px"}
      templateColumns="repeat(auto-fill, minmax(275px, 1fr))"
    >
      {...devices}
      {/* <NewDevice /> */}
    </SimpleGrid>
  );
}
