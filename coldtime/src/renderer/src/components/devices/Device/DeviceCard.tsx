import { Box, Text } from "@chakra-ui/react";
import { IDevice } from "@renderer/types/device";
import { formatDateToTimestamp } from "@renderer/utils/formatDate";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaWifi } from "react-icons/fa";
import { MdOutlinePowerSettingsNew } from "react-icons/md";
import { Link } from "react-router-dom";

interface IDeviceProps {
  device: IDevice;
  overrideLink?: string | null;
}

const DeviceCard = ({ device, overrideLink }: IDeviceProps) => {
  const { t } = useTranslation();
  const { id, name, ip, port, lastState } = device;

  const isOnline = lastState?.isConnected || false;
  const temperature = lastState?.data?.temperature;
  const date = lastState?.date;

  const formattedDate = useMemo(
    () => (date ? formatDateToTimestamp(date) : t("device.status.noData")),
    [date]
  );

  console.log(device);

  return (
    <Box
      as={Link}
      to={overrideLink ?? `/device/${id}`}
      bg="transparent"
      boxShadow={
        isOnline
          ? "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
          : "0 12px 24px 0 rgba(47, 48, 18, 0.37)"
      }
      backdropFilter="blur(16.0px)"
      borderRadius="10px"
      border="1px solid rgba(255, 255, 255, 0.18)"
      height="200px"
      width="300px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
      transition=".3s"
      _hover={{
        transform: "translateY(-10px)",
        boxShadow: isOnline
          ? "0 12px 24px 0 rgba(31, 38, 135, 0.5)"
          : "0 12px 24px 0 rgba(92, 94, 21, 0.5)",
      }}
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bgGradient={
          isOnline
            ? "linear(to-b, #64dfdf, #8eb9f6)"
            : "linear(135deg, rgba(153, 15, 118, 0.5), rgba(107, 86, 2, 0.5))"
        }
        opacity="0.5"
        zIndex="-1"
      ></Box>
      <Box position="absolute" top="20px" left="20px">
        <Text fontSize="xl" fontWeight="bold" color="white">
          {name}
        </Text>
        <Text fontSize="sm" color="white" mt="2">
          IP: {ip}:{port}
        </Text>
      </Box>
      <Box position="absolute" top="20px" right="20px">
        {isOnline ? (
          <FaWifi size={20} color="#2ecc71" />
        ) : (
          <FaWifi size={20} color="#e74c3c" />
        )}
      </Box>
      <Box position="absolute" bottom="20px" left="20px">
        {temperature ? (
          <>
            <Text fontSize="4xl" fontWeight="bold" color="white">
              {temperature}&deg;C
            </Text>
            <Text fontSize="sm" color="white" mt="2">
              {t("device.status.dataFrom", { date: formattedDate })}
            </Text>
          </>
        ) : (
          <Text fontSize="sm" color="white" mt="2">
            {t("device.status.noData")}
          </Text>
        )}
      </Box>
      <Box position="absolute" bottom="20px" right="20px">
        {lastState?.data?.isRunning ? (
          <MdOutlinePowerSettingsNew size={40} color="#39ffe5" />
        ) : (
          <MdOutlinePowerSettingsNew size={40} color="#95a5a6" />
        )}
      </Box>
    </Box>
  );
};

export default DeviceCard;
