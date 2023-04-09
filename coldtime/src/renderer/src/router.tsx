import { createBrowserRouter } from "react-router-dom";
import DeviceDetails from "./components/device/DeviceDetails";
import DeviceForm from "./components/devices/DeviceForm/DeviceForm";

import Home from "./components/Home/Home";
import InitScreen from "./components/init/InitScreen";
import Settings from "./components/settings/Settings";
import WithDrawer from "./components/UI/WithDrawer";
const router = createBrowserRouter([
  {
    path: "init",
    element: <InitScreen />,
  },
  {
    path: "*",
    element: <WithDrawer />,
    children: [
      {
        path: "device",
        children: [
          {
            path: "add",
            element: <DeviceForm />,
          },
          {
            path: ":deviceId",
            element: <DeviceDetails />,
          },
        ],
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "*",
        element: <Home />,
      },
    ],
  },
]);
export default router;
