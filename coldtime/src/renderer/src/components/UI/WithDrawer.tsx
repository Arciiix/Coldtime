import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Drawer from "./Drawer";

export default function WithDrawer() {
  return (
    <div className="flex">
      <Drawer />
      <Box w={"80px"} flexShrink="0"></Box>
      <div className="flex-1 flex-shrink-0 flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
}
