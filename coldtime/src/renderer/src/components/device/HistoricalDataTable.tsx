import {
  Button,
  Icon,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import { usePagination } from "@renderer/hooks/usePagination";
import { IDeviceState } from "@renderer/types/device";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaWifi } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import Pagination from "./Pagination";

export default function HistoryTable({
  historyData,
  handleRefresh,
  isRefreshing,
}) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { currentPageData, totalPages } = usePagination<IDeviceState>(
    historyData,
    currentPage,
    pageSize
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [historyData]);

  return (
    <>
      <Button
        my={4}
        onClick={handleRefresh}
        isLoading={isRefreshing}
        loadingText={t("loading")}
        flexShrink={"0"}
        colorScheme="blue"
        variant="outline"
        p={"5"}
        size="sm"
      >
        <MdRefresh /> {t("refresh")}
      </Button>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
      <Table variant="simple" bg={colorMode === "light" ? "white" : "gray.800"}>
        <Thead bg={colorMode === "light" ? "gray.100" : "gray.700"}>
          <Tr>
            <Th>{t("device.date")}</Th>
            <Th>{t("device.connectionState")}</Th>
            <Th>{t("device.isRunning")}</Th>
            <Th>{t("device.temperature")}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentPageData.map((data, index) => (
            <Tr key={index}>
              <Td>{new Date(data.date).toLocaleString()}</Td>
              <Td>
                <Icon
                  as={FaWifi}
                  fontSize="2xl"
                  color={data.isConnected ? "green.500" : "red.500"}
                />
              </Td>

              <Td>
                {data.data?.isRunning ? (
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
              <Td>
                {data.data?.temperature === null ||
                data.data?.temperature === undefined
                  ? "-"
                  : `${data.data?.temperature.toFixed(2)}°C`}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </>
  );
}
