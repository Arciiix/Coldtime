import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { IDevice } from "@renderer/types/device";
import { useTranslation } from "react-i18next";
import DeviceForm from "./DeviceForm";

interface IEditDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editedDevice: IDevice | null;
}

export default function EditDeviceModal({
  isOpen,
  onClose,
  editedDevice,
}: IEditDeviceModalProps) {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("device.editDevice.title")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DeviceForm editedDevice={editedDevice} hideTitle />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
