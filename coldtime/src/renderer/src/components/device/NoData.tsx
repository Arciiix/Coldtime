import { Alert, AlertDescription, AlertIcon, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function NoData() {
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
      p={8}
      rounded="xl"
      my={4}
      flexShrink={"0"}
    >
      <AlertIcon boxSize={14} mr={0} />
      <AlertDescription maxWidth="sm" h="max-content" flexShrink={"0"}>
        <Text fontSize="2xl" m={3}>
          {t("device.status.noData")}
        </Text>
      </AlertDescription>
    </Alert>
  );
}
