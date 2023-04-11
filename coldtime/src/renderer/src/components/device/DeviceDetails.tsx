import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Text,
} from "@chakra-ui/react";
import settingsState from "@renderer/state/settings/settings";
import { IDevice, IDeviceState, IDeviceStats } from "@renderer/types/device";
import {
  exportToCSV,
  exportToExcel,
  exportToJSON,
} from "@renderer/utils/exportData";
import {
  formatDateAgo,
  formatDateToTimestamp,
} from "@renderer/utils/formatDate";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFile, FaFileCsv, FaFileExcel, FaWifi } from "react-icons/fa";

import {
  MdOutlinePowerSettingsNew,
  MdOutlineShowChart,
  MdRefresh,
  MdThermostat,
} from "react-icons/md";
import { DateObject } from "react-multi-date-picker";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import LoadingOverlay from "../UI/Loading/LoadingOverlay";
import RangeDatePicker from "../UI/RangeDatePicker";
import ChartComponent from "./Chart/ChartComponent";
import Legend from "./Chart/Legend";
import HistoricalDataTable from "./HistoricalDataTable";

const { ipcRenderer } = window.require("electron");

export default function DeviceDetails() {
  const { t } = useTranslation();
  const { deviceId: id } = useParams();

  const settings = useRecoilValue(settingsState);

  /*
    1. currentState - actual state, i.e. isConnected, temperature etc.
    2. deviceData - general device info, e.g. IP address and name
    3. deviceStats - device stats, such as lastConnectionStatusChange
  */
  const [currentState, setCurrentState] = useState<IDeviceState | null>(null);
  const [deviceData, setDeviceData] = useState<IDevice | null>(null);
  const [deviceStats, setDeviceStats] = useState<IDeviceStats | null>(null);
  const [numberOfDataPointsStripped, setNumberOfDataPointsStripped] =
    useState(0);
  const [historicalDataRefreshTime, setHistoricalDataRefreshTime] = useState(
    new Date().getTime()
  );

  const [startDate, setStartDate] = useState<DateObject | null>(
    new DateObject(new Date().getTime() - 1000 * 60 * 60)
  ); // one hour
  const [endDate, setEndDate] = useState<DateObject | null>(null);

  const [historicalData, setHistoricalData] = useState<IDeviceState[]>([]);
  const historicalDataSorted = useMemo(() => {
    return historicalData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [historicalData]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formattedDate =
    (currentState?.date && formatDateToTimestamp(currentState?.date)) ??
    t("device.status.noData");

  const isRunningChangeText = useMemo(() => {
    if (deviceStats?.lastIsRunningChange) {
      return formatDateAgo(new Date(deviceStats.lastIsRunningChange));
    }
    return t("device.stats.allAlong");
  }, [deviceStats]);

  const device: IDevice | null = deviceData
    ? { ...deviceData, lastState: currentState }
    : null;

  const getDeviceData = async () => {
    try {
      const { data } = await ipcRenderer.invoke("GET_DEVICE_DATA", id);
      setCurrentState(data);
    } catch (err) {
      setCurrentState(null);
      console.error(`Error while getting data: ${err}`);
    }
  };

  const getDeviceInfo = async () => {
    const { device } = await ipcRenderer.invoke("GET_DEVICE", id);
    setDeviceData(device);
  };

  const getDeviceStats = async () => {
    const stats = (await ipcRenderer.invoke(
      "GET_DEVICE_STATS",
      id
    )) satisfies IDeviceStats;
    setDeviceStats(stats);
  };

  const handleRefresh = async (historicalDataAsWell?: boolean) => {
    setIsRefreshing(true);
    console.log("refreshing...");

    await getDeviceData();
    await getDeviceStats();

    if (historicalDataAsWell) {
      // Due to React's nature with weird state lifecycle, we have to ensure we have the latest state
      const startDate: DateObject | null = await new Promise((resolve) =>
        setStartDate((prev) => {
          resolve(prev);
          return prev;
        })
      );
      const endDate: DateObject | null = await new Promise((resolve) =>
        setEndDate((prev) => {
          resolve(prev);
          return prev;
        })
      );

      const { data, numberOfDataPointsStripped } = await ipcRenderer.invoke(
        "GET_HISTORICAL_DATA",
        {
          id,
          start: startDate?.toDate(),
          end: endDate?.toDate(),
        }
      );
      setHistoricalData(data satisfies IDeviceState[]);
      setHistoricalDataRefreshTime(new Date().getTime());
      setNumberOfDataPointsStripped(numberOfDataPointsStripped);
      console.log(data);
    }
    setIsRefreshing(false);
  };

  const handleDateChange = (dates: [DateObject | null, DateObject | null]) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  useEffect(() => {
    setCurrentState(null);
    setDeviceData(null);

    const interval = setInterval(
      () => {
        console.log("Details refresh");
        getDeviceData();
        getDeviceStats();
      },
      (settings?.checkInterval.value ?? 30) * 1000
      // TODO: Add refresh interval
    );

    getDeviceInfo().then(() => handleRefresh(true));

    return () => {
      clearInterval(interval);
    };
  }, [id]);

  if (!deviceData || !device) {
    // TODO
    return <h1>loading</h1>;
  }
  return (
    <Box h="100vh" overflowY={"auto"}>
      <Flex
        direction="column"
        h="full"
        mx="auto"
        px="4"
        py="8"
        textAlign="center"
      >
        <LoadingOverlay isLoading={isRefreshing} />
        <Heading as="h1" size="2xl" my="4">
          {deviceData.name}
        </Heading>
        <Grid
          templateColumns="repeat(2, 1fr)"
          gap={6}
          mb="8"
          borderRadius="md"
          boxShadow="base"
          height="max-content"
          // bg={"gray.800"}
        >
          <GridItem colSpan={1} p="6">
            <Icon
              as={FaWifi}
              fontSize="4xl"
              color={currentState?.isConnected ? "green.500" : "red.500"}
            />
            <Text fontSize="xl" fontWeight="semibold" mt="4">
              {currentState?.isConnected
                ? t("device.status.connected")
                : t("device.status.disconnected")}
            </Text>
            <Text color="gray.300">{`${deviceData.ip}:${deviceData.port}`}</Text>
          </GridItem>
          <GridItem colSpan={1} p="6">
            <Icon
              as={MdOutlineShowChart}
              fontSize="4xl"
              color={
                deviceStats?.averageTemperatureToday === null
                  ? "gray.400"
                  : "blue.400"
              }
            />
            <Text fontSize="xl" fontWeight="semibold" mt="4">
              {deviceStats?.averageTemperatureToday?.toFixed(2) ?? "-"} &deg;C
            </Text>
            <Text color="gray.300">
              {t("device.stats.averageTemperatureToday")}
            </Text>
          </GridItem>
          {currentState?.data ? (
            <>
              <GridItem colSpan={1} p="6">
                <Icon
                  as={MdOutlinePowerSettingsNew}
                  fontSize="5xl"
                  color={currentState.data.isRunning ? "green.500" : "gray.500"}
                />
                <Text fontSize="xl" fontWeight="semibold" mt="4">
                  {currentState.data.isRunning
                    ? t("device.status.on")
                    : t("device.status.off")}
                </Text>
                <Text color="gray.300">{isRunningChangeText}</Text>
              </GridItem>
              <GridItem colSpan={1} p="6">
                {currentState.data.temperature ? (
                  <>
                    <Icon as={MdThermostat} fontSize="5xl" color={"blue.400"} />
                    <Text fontSize="2xl" fontWeight={"semibold"} mt="4">
                      {currentState.data.temperature}&deg;C
                    </Text>
                  </>
                ) : (
                  <Text fontSize="xl" mt="4">
                    {t("device.status.noData")}
                  </Text>
                )}
              </GridItem>
            </>
          ) : null}
          <GridItem colSpan={2}>
            <Flex gap={2} justifyContent="center" alignItems="center" mt="4">
              <Text fontSize="lg">
                {t("device.status.lastUpdated", { date: formattedDate })}
              </Text>
              <IconButton
                aria-label={t("refresh")}
                variant="ghost"
                rounded="full"
                onClick={() => handleRefresh(false)}
                isLoading={isRefreshing}
                isDisabled={isRefreshing}
              >
                <MdRefresh />
              </IconButton>
            </Flex>
          </GridItem>
        </Grid>
        <RangeDatePicker
          value={[startDate, endDate]}
          onChange={handleDateChange}
          onSubmit={() => handleRefresh(true)}
          disabled={isRefreshing}
        />
        <Divider />

        <ChartComponent
          key={historicalDataRefreshTime}
          data={historicalData}
          numberOfDataPointsStripped={numberOfDataPointsStripped}
          dateFrom={startDate?.toUnix() ?? null}
          dateTo={endDate?.toUnix() ?? null}
        />

        <Legend />
        <Divider />
        <Flex justifyContent="center" gap={2} my={3} p={2}>
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
        <HistoricalDataTable
          historyData={historicalDataSorted}
          handleRefresh={() => handleRefresh(true)}
          isRefreshing={isRefreshing}
        />
      </Flex>
    </Box>
  );
}
