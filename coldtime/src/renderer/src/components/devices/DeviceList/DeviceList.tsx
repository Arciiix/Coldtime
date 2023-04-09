import { SimpleGrid } from "@chakra-ui/react";
import { useConfirmDialog } from "@renderer/context/confirmationDialogContext";
import useContextMenu from "@renderer/hooks/useContextMenu";
import deviceListState from "@renderer/state/devices/deviceList";
import { IDevice } from "@renderer/types/device";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdDelete, MdEdit } from "react-icons/md";
import { useRecoilState } from "recoil";
import DeviceCard from "../Device/DeviceCard";
import EditDeviceModal from "../DeviceForm/EditDeviceModal";
const { ipcRenderer } = window.require("electron");

interface IDeviceListProps {
  devices: IDevice[];
}

export default function DeviceList(props: IDeviceListProps) {
  const { t } = useTranslation();
  const confirmDialog = useConfirmDialog();

  const [editedDevice, setEditedDevice] = useState<IDevice | null>(null);
  const [isEditingDevice, setIsEditingDevice] = useState(false);

  const [_, setAllDevices] = useRecoilState(deviceListState);

  const onDeviceDelete = async (device: IDevice) => {
    // Ask for user confirmation
    const isConfirmed = await confirmDialog(
      t("device.deleteDevice.title"),
      t("device.deleteDevice.description")
    );
    if (!isConfirmed) return;
    console.log("Delete device", device.id);

    const { devices } = await ipcRenderer.invoke("DELETE_DEVICE", device.id);
    setAllDevices(devices);
  };

  const options = useMemo(
    () =>
      editedDevice
        ? [
            // TODO
            // {
            //   label: t("device.contextMenu.openInNewWindow"),
            //   prefix: <FaExternalLinkAlt />,
            //   handler: () => {

            //   },
            // },
            {
              label: t("device.contextMenu.edit"),
              prefix: <MdEdit />,
              handler: () => setIsEditingDevice(true),
            },
            {
              label: t("device.contextMenu.delete"),
              prefix: <MdDelete />,
              handler: () => onDeviceDelete(editedDevice),
            },
          ]
        : [],
    [editedDevice]
  );

  const handleEditDeviceModalClose = useCallback(() => {
    setIsEditingDevice(false);
    setEditedDevice(null);
  }, []);

  const { isOpen, menu, onContextMenu } = useContextMenu(options);

  const devices = useMemo(
    () =>
      props.devices.map((e) => {
        // return <Device {...e} />;
        return (
          <DeviceCard
            onContextMenu={(ev) => {
              ev.preventDefault();
              setEditedDevice(e);
              onContextMenu(ev);
            }}
            device={e}
          />
        );
      }),
    [props.devices]
  );

  return (
    <>
      <EditDeviceModal
        isOpen={isEditingDevice}
        onClose={handleEditDeviceModalClose}
        editedDevice={editedDevice}
      />
      <SimpleGrid
        spacing={"30px"}
        templateColumns="repeat(auto-fill, minmax(275px, 1fr))"
      >
        {...devices}
        {/* <NewDevice /> */}
      </SimpleGrid>
      {isOpen && menu}
    </>
  );
}
