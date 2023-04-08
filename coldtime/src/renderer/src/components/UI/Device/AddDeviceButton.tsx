import { Box, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";

export default function AddDeviceButton() {
  const { t } = useTranslation();

  return (
    <Tooltip label={t("drawer.addDevice")}>
      <Box
        as={Link}
        to="/device/add"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="50px"
        h="50px"
        borderRadius="50%"
        bgGradient="linear(to-tr, teal.300, blue.400)"
        bgSize="300% 100%"
        boxShadow="20px 20px 50px rgba(0, 0, 0, 0.2), -20px -20px 50px rgba(255, 255, 255, 0.2)"
        transition="all 0.3s ease-out"
        _hover={{
          backgroundPosition: "100% 0%",
          cursor: "pointer",
        }}
      >
        <MdAdd size={24} color="#fff" />
      </Box>
    </Tooltip>
  );
}
