import {
  Box,
  Divider,
  IconButton,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import deviceListState from "@renderer/state/devices/deviceList";
import { useTranslation } from "react-i18next";
import { MdSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import AddDeviceButton from "./Device/AddDeviceButton";
import DrawerDeviceList from "./Device/DrawerDeviceList";
import logo from "../../assets/logo.png";

export default function Drawer() {
  const { t } = useTranslation();
  const devices = useRecoilValue(deviceListState);

  return (
    // <div className="h-screen fixed top-0 w-[72px] py-3 pl-1 z-50">
    <Box h="100vh" pos="fixed" top="0" w="72px" py="3" pl="1" zIndex="50">
      <Box
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
          bg="whiteAlpha.300"
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
            src={logo}
            alt="Coldtime logo"
            borderRadius="full"
            w={"20"}
            transition="all 0.3s"
            _hover={{
              boxShadow: "0 12px 32px 0 rgba(53, 98, 171, 0.8)",
            }}
          />
        </Link>
        <Text fontSize="xs" color="gray.200" fontWeight="semibold" mt="2">
          Coldtime
        </Text>

        <Divider my={4} />
        {devices && devices.length ? (
          <>
            <DrawerDeviceList />
            <Divider my={4} />
          </>
        ) : null}
        <AddDeviceButton />
        <Tooltip label={t("settings.settings")}>
          <IconButton
            as={Link}
            to={"/settings"}
            aria-label={t("settings.settings")}
            rounded="full"
            size="lg"
            m={4}
            variant="outline"
            flexShrink="0"
          >
            <MdSettings />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
