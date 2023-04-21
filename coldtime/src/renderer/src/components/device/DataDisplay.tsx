import { Button, Divider, Flex } from "@chakra-ui/react";
import { AIReturnType } from "@renderer/types/device";
import {
  exportToCSV,
  exportToExcel,
  exportToJSON,
} from "@renderer/utils/exportData";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaFile, FaFileCsv, FaFileExcel } from "react-icons/fa";

import ChartComponent from "./Chart/ChartComponent";
import Legend from "./Chart/Legend";
import HistoricalDataTable from "./HistoricalDataTable";

interface IDataDisplay {
  // TODO
  historicalDataRefreshTime: any;
  historicalData: any;
  lowerSize: any;
  deviceData: any;
  handleRefresh: any;
  isRefreshing: boolean;
  canRefresh: boolean;
  aiData?: AIReturnType | null;
  hideLegend?: boolean;
  hideExport?: boolean;
}

export default function DataDisplay({
  historicalDataRefreshTime,
  historicalData,
  lowerSize,
  deviceData,
  handleRefresh,
  isRefreshing,
  canRefresh,
  aiData,
  hideLegend,
  hideExport,
}: IDataDisplay) {
  const { t } = useTranslation();
  const historicalDataSorted = useMemo(() => {
    // We have to copy the array - because Array.sort returns the reference for the original array, which is immutable here
    return [...historicalData].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [historicalData]);

  return (
    <>
      <ChartComponent
        key={historicalDataRefreshTime}
        data={historicalData}
        aiData={aiData}
      />

      {hideLegend ? null : <Legend />}
      <Divider />
      {hideExport ? null : (
        <>
          <Flex
            justifyContent="center"
            flexDir={lowerSize ? "column" : "row"}
            gap={2}
            my={3}
            p={2}
          >
            <Button
              colorScheme="green"
              variant="outline"
              leftIcon={<FaFileExcel />}
              onClick={() => exportToExcel(deviceData, historicalDataSorted)}
              mr={2}
            >
              {t("export.excel")}
            </Button>
            <Button
              colorScheme="orange"
              variant="outline"
              leftIcon={<FaFileCsv />}
              onClick={() => exportToCSV(deviceData, historicalDataSorted)}
              mr={2}
            >
              {t("export.csv")}
            </Button>
            <Button
              colorScheme="blue"
              variant="outline"
              leftIcon={<FaFile />}
              onClick={() => exportToJSON(deviceData, historicalDataSorted)}
            >
              {t("export.json")}
            </Button>
          </Flex>
          <Divider />
        </>
      )}
      <HistoricalDataTable
        historyData={historicalDataSorted}
        aiData={aiData}
        lowerSize={lowerSize}
        canRefresh={canRefresh}
        handleRefresh={() => handleRefresh(true)}
        isRefreshing={isRefreshing}
      />
    </>
  );
}
