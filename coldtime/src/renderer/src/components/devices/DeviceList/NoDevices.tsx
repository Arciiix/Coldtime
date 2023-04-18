import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router-dom";

export default function NoDevices() {
  const { t } = useTranslation();

  return (
    <Alert
      gap={3}
      status="warning"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
      flexShrink={"0"}
      rounded="xl"
      backdropFilter="blur(16.0px)"
      boxShadow={"0 8px 32px 0 rgba(137, 150, 27, 0.07)"}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bgGradient={"linear(to-b, #FDC830, #F37335)"}
        opacity="0.1"
        zIndex="-1"
      ></Box>
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {t("deviceList.noDevices")}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        <Box
          as={Link}
          to="/device/add"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          p={3}
          rounded="xl"
          bgGradient="linear(to-tr, teal.600, blue.700)"
          bgSize="300% 100%"
          transition="all 0.3s ease-out"
          _hover={{
            backgroundPosition: "100% 0%",
            cursor: "pointer",
          }}
        >
          <MdAdd size={24} />
          {t("deviceList.add")}
        </Box>
      </AlertDescription>
    </Alert>
  );
}
