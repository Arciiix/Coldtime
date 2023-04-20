import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";

export default function NewDevice() {
  const { t } = useTranslation();
  return (
    <Button
      as={Link}
      to="/device/add"
      variant="outline"
      colorScheme={"blue"}
      display="flex"
      flexDir={"column"}
      h="full"
      w="full"
    >
      <MdAdd size={32} />
      {t("device.addNewDevice")}
    </Button>
  );
}
