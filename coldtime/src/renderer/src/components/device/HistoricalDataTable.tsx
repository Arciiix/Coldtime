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
import { AIReturnType, IDeviceState } from "@renderer/types/device";
import { formatDateToTimestamp } from "@renderer/utils/formatDate";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaWifi } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import Pagination from "./Pagination";

interface IHistoryTableProps {
  // TODO
  historyData: any;
  canRefresh: any;
  handleRefresh: any;
  isRefreshing: boolean;
  lowerSize: boolean;
  aiData?: AIReturnType | null;
}

export default function HistoryTable({
  historyData,
  canRefresh,
  handleRefresh,
  isRefreshing,
  lowerSize,
  aiData,
}: IHistoryTableProps) {
  const { colorMode } = useColorMode();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const aiDataParsed = useMemo(() => {
    if (!aiData) return null;
    return [
      ...aiData.lastPoints,
      ...aiData.predictions.map((e) => ({
        isConnected: true,
        date: new Date(e.date),

        data: {
          temperature: e.temperature,
          isRunning: true,
        },
      })),
    ];
  }, [aiData]);

  const { currentPageData, totalPages } = usePagination<IDeviceState>(
    aiDataParsed ?? historyData,
    currentPage,
    pageSize
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [historyData]);

  return (
    <>
      {canRefresh ? (
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
      ) : null}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
        lowerSize={lowerSize}
      />
      <Table
        variant="simple"
        bg={colorMode === "light" ? "white" : "gray.800"}
        size="md"
        maxW={"min(100%, calc(100vw - 160px))"}
        marginX="auto"
      >
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
              <Td>{formatDateToTimestamp(new Date(data.date))}</Td>
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
        lowerSize={lowerSize}
      />
    </>
  );
}
