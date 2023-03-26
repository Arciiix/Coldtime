import { IDevice, IDeviceState } from "@renderer/types/device";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Box, Flex, Heading, Text, Badge, Divider } from "@chakra-ui/react";

const { ipcRenderer } = window.require("electron");

export default function DeviceDetails() {
  const { t } = useTranslation();
  const { id } = useParams();

  const [currentState, setCurrentState] = useState<IDeviceState | null>(null);
  const [deviceData, setDeviceData] = useState<IDevice | null>(null);

  const getDeviceData = async () => {
    const { data } = await ipcRenderer.invoke("GET_DEVICE_DATA", id);

    setCurrentState(data);
  };

  const getDeviceInfo = async () => {
    const { device } = await ipcRenderer.invoke("GET_DEVICE", id);
    setDeviceData(device);
  };

  useEffect(() => {
    const interval = setInterval(getDeviceData, 5000);
    getDeviceInfo();
    getDeviceData();

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!currentState || !deviceData) {
    // TODO
    return <h1>loading</h1>;
  }
  return (
    <Box
      p={6}
      bg="gray.800"
      color="white"
      borderRadius="md"
      boxShadow="md"
      _hover={{ boxShadow: "lg" }}
      userSelect={"none"}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md" fontWeight="bold">
          {deviceData.name}
        </Heading>
        <Badge
          colorScheme={currentState.isConnected ? "green" : "red"}
          variant="solid"
          fontSize="md"
          py={2}
          px={3}
          borderRadius="full"
        >
          {currentState.isConnected
            ? t("device.status.connected")
            : t("device.status.disconnected")}
        </Badge>
      </Flex>
      <Divider mb={4} borderColor="whiteAlpha.500" />
      {currentState.data ? (
        <Flex justify="space-between" align="center" mb={4}>
          <Box>
            <Text fontSize="3xl" fontWeight="bold" mb={2}>
              {currentState.data.temperature.toFixed(2)}°C
            </Text>
            <Badge
              colorScheme={currentState.data.isRunning ? "green" : "red"}
              variant="solid"
              fontSize="md"
              py={2}
              px={3}
              borderRadius="full"
            >
              {currentState.data.isRunning
                ? t("device.status.on")
                : t("device.status.off")}
            </Badge>
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              {t("device.status.lastUpdated", {
                date: new Date(currentState.date).toString(),
              })}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {`${deviceData.ip}:${deviceData.port}`}
            </Text>
          </Box>
        </Flex>
      ) : (
        <Text color="gray.500" textAlign="center">
          {t("device.status.noData")}
        </Text>
      )}
    </Box>
  );
}
