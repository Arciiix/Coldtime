import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface ConfirmationDialogContextProps {
  isOpen: boolean;
  title: string;
  message: string;
  openConfirmationDialog: (
    title: string,
    message: string,
    onConfirm: () => void
  ) => void;
  confirm: () => void;
  closeConfirmationDialog: () => void;
}

interface ConfirmationDialogProviderProps {
  children: ReactNode;
}

const ConfirmationDialogContext = createContext<ConfirmationDialogContextProps>(
  {
    isOpen: false,
    title: "",
    message: "",
    openConfirmationDialog: () => {},
    confirm: () => {},
    closeConfirmationDialog: () => {},
  }
);

export const ConfirmationDialogProvider: React.FC<
  ConfirmationDialogProviderProps
> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});

  const openConfirmationDialog = useCallback(
    (title: string, message: string, onConfirm: () => void) => {
      setIsOpen(true);
      setTitle(title);
      setMessage(message);
      setOnConfirm(() => onConfirm);
    },
    []
  );

  const closeConfirmationDialog = useCallback(() => {
    setIsOpen(false);
    setTitle("");
    setMessage("");
    setOnConfirm(() => {});
  }, []);

  const confirm = useCallback(() => {
    onConfirm();
    closeConfirmationDialog();
  }, [onConfirm, closeConfirmationDialog]);

  return (
    <ConfirmationDialogContext.Provider
      value={{
        isOpen,
        title,
        message,
        openConfirmationDialog,
        confirm,
        closeConfirmationDialog,
      }}
    >
      {children}
    </ConfirmationDialogContext.Provider>
  );
};

export const useConfirmDialog = (): ((
  title: string,
  message: string
) => Promise<boolean>) => {
  const { openConfirmationDialog } = useContext(ConfirmationDialogContext);

  const confirmDialog = useCallback(
    async (title: string, message: string) => {
      return new Promise<boolean>((resolve) => {
        openConfirmationDialog(title, message, () => resolve(true));
      });
    },
    [openConfirmationDialog]
  );

  return confirmDialog;
};

export const ConfirmationDialog: React.FC = () => {
  const { isOpen, title, message, confirm, closeConfirmationDialog } =
    useContext(ConfirmationDialogContext);
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={closeConfirmationDialog}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={confirm}>
            {t("confirm")}
          </Button>
          <Button variant="ghost" onClick={closeConfirmationDialog}>
            {t("cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
