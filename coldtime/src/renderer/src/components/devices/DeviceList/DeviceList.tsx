import { SimpleGrid } from "@chakra-ui/react";
import { IDevice } from "@renderer/types/device";
import { useMemo } from "react";
import Device from "../Device/Device";
import NewDevice from "./NewDevice";

interface IDeviceListProps {
  devices: IDevice[];
}

export default function DeviceList(props: IDeviceListProps) {
  const devices = useMemo(
    () =>
      props.devices.map((e) => {
        return <Device {...e} />;
      }),
    [props.devices]
  );

  return (
    <SimpleGrid
      spacing={4}
      templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
    >
      {...devices}
      <NewDevice />
    </SimpleGrid>
  );
}
