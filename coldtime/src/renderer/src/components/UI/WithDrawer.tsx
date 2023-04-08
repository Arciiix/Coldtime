import { Outlet } from "react-router-dom";
import Drawer from "./Drawer";

export default function WithDrawer() {
  return (
    <div className="flex w-screen">
      <Drawer />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
