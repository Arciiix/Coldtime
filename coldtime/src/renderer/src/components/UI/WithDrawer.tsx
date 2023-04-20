import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Drawer from "./Drawer";

export default function WithDrawer() {
  return (
    <Flex>
      <Drawer />
      <Box w={"80px"} flexShrink="0"></Box>
      <Box flex={1} flexShrink={0} flexGrow={1}>
        <Outlet />
      </Box>
    </Flex>
  );
}
