import { Avatar, AvatarBadge, Badge, Tooltip } from "@chakra-ui/react";
import deviceListState from "@renderer/state/devices/deviceList";
import { useMemo } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

export default function DrawerDeviceList() {
  const { deviceId } = useParams();
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

            return (
              <Link key={id} to={`/device/${id}`}>
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

  return <>{renderDevices}</>;
}
