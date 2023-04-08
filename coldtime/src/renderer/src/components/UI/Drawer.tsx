import {
  Avatar,
  AvatarBadge,
  Badge,
  Box,
  Divider,
  IconButton,
  Image,
  Tooltip,
} from "@chakra-ui/react";
import deviceListState from "@renderer/state/devices/deviceList";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

export default function Drawer() {
  const { deviceId } = useParams();
  const { t } = useTranslation();
  const devices = useRecoilValue(deviceListState);

  const renderDevices = useMemo(() => {
    return (
      <>
        {/* Sort by connection state - active and connected devices first */}
        {[...devices]
          .sort((a, _) => (a.lastState?.isConnected ? -1 : 1))
          .map(({ name, lastState, id }) => {
            const isOnline = lastState?.isConnected ?? false;
            const statusIcon = isOnline ? (
              <FaCheckCircle size={12} color="#68D391" />
            ) : (
              <FaExclamationCircle size={12} color="#FC8181" />
            );
            const isSelected = deviceId !== "" && id === deviceId;

            //   return (
            //     <Box bg={"#2D3748"} p={1} rounded="xl" textAlign="center" my={2}>
            //       <Avatar size="xs" name={name} src="#" mb={2} />

            //       <Text fontSize="xs" fontWeight="bold" mb={1}>
            //         {name}
            //       </Text>

            //       <Badge
            //         colorScheme={isOnline ? "green" : "red"}
            //         variant="subtle"
            //         fontWeight="bold"
            //         display="flex"
            //         alignItems="center"
            //         justifyContent="center"
            //       >
            //         {statusIcon}
            //       </Badge>
            //     </Box>
            //   );

            return (
              <Link to={`/device/${id}`}>
                <Tooltip label={isOnline ? name : name + " - offline"}>
                  <Avatar
                    {...(!isOnline
                      ? {
                          color: "gray",
                          bgColor: "gray.600",
                        }
                      : {})}
                    {...(isSelected
                      ? {
                          color: "white",
                          border: "2px solid transparent",
                          borderRadius: "md",
                          bgGradient: "linear(to-l, #4F8ECD, #45B1E1)",
                          _hover: { borderColor: "blue.500" },
                          _focus: { outline: "none", boxShadow: "outline" },
                          transitionDuration: "0.2s",
                          position: "relative",
                          _before: {
                            content: "''",
                            position: "absolute",
                            zIndex: "-1",
                            top: "-2px",
                            left: "-2px",
                            right: "-2px",
                            bottom: "-2px",
                            background:
                              "linear-gradient(to right, #4F8ECD, #45B1E1)",
                            borderRadius: "md",
                            filter: "blur(10px)",
                          },
                        }
                      : {})}
                    my={2}
                    size="md"
                    name={name}
                    transitionDuration={"0.2s"}
                    transitionProperty={"all"}
                    _hover={{
                      transform: "translateY(-5px)",
                      cursor: "pointer",
                    }}
                  >
                    <AvatarBadge
                      as={Badge}
                      borderColor="transparent"
                      colorScheme={isOnline ? "green" : "red"}
                      variant="subtle"
                      fontWeight="bold"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {statusIcon}
                    </AvatarBadge>
                  </Avatar>
                </Tooltip>
              </Link>
            );
          })}
      </>
    );
  }, [devices, deviceId]);
  return (
    <div className="h-screen fixed top-0 w-[72px] py-3 pl-1">
      <Box
        bg="gray.700"
        backdropFilter="blur(20px) saturate(150%)"
        borderRadius="xl"
        boxShadow="md"
        py="3"
        px="1"
        position="relative"
        overflow="hidden"
        h="full"
        w="full"
        overflowY="auto"
        display="flex"
        flexDir="column"
        alignItems="center"
        sx={{
          "&::-webkit-scrollbar": {
            width: "4px",
            height: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "gray.400",
            borderRadius: "full",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "gray.500",
          },
          "scrollbar-width": "thin",
          "-ms-overflow-style": "none",
          "scrollbar-color": "gray.400 transparent",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Box
          bg="whiteAlpha.200"
          filter="blur(20px)"
          height="100%"
          position="absolute"
          top="-20px"
          left="-20px"
          right="-20px"
          bottom="-20px"
          zIndex="-1"
        />
        <Link to="/">
          <Image
            src="/src/assets/logo.png"
            alt="Coldtime logo"
            borderRadius="full"
            w={"20"}
          />
        </Link>
        <span className="text-xs text-gray-200 font-semibold mt-2">
          Coldtime
        </span>
        <Divider my={4} />
        {renderDevices}
        <Divider my={4} />

        <Tooltip label={t("drawer.addDevice")}>
          <Box
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
      </Box>
    </div>
  );
}
