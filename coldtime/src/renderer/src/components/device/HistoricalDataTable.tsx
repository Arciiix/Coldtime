import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorMode,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function HistoryTable({
  historyData,
  handleRefresh,
  isRefreshing,
}) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  return (
    <>
      <Button
        my={4}
        onClick={handleRefresh}
        isLoading={isRefreshing}
        loadingText="Refreshing"
        colorScheme="blue"
        variant="solid"
        size="sm"
      >
        {t("refresh")}
      </Button>
      <Table variant="simple" bg={colorMode === "light" ? "white" : "gray.800"}>
        <Thead bg={colorMode === "light" ? "gray.100" : "gray.700"}>
          <Tr>
            <Th>{t("device.date")}</Th>
            <Th>{t("device.temperature")}</Th>
            <Th>{t("device.isRunning")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {historyData.map((data, index) => (
            <Tr key={index}>
              <Td>{new Date(data.date).toLocaleString()}</Td>
              <Td>{data.data.temperature}°C</Td>
              <Td>
                {data.data.isRunning ? (
                  <span
                    style={{
                      color: "#10B981",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {t("device.status.on")}
                  </span>
                ) : (
                  <span
                    style={{
                      color: "#EF4444",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    {t("device.status.off")}
                  </span>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
