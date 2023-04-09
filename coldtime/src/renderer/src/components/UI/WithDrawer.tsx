import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Drawer from "./Drawer";

export default function WithDrawer() {
  return (
    <div className="flex">
      <Drawer />
      <Box w={"80px"}></Box>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
