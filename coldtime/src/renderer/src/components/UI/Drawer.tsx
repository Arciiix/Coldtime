import { Box, Divider, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AddDevice from "./Device/AddDevice";
import DrawerDeviceList from "./Device/DrawerDeviceList";

export default function Drawer() {
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
        <DrawerDeviceList />
        <Divider my={4} />
        <AddDevice />
      </Box>
    </div>
  );
}