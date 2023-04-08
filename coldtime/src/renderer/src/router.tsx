import { createBrowserRouter } from "react-router-dom";
import DeviceDetails from "./components/device/DeviceDetails";
import AddDevice from "./components/devices/AddDevice/AddDevice";

import Home from "./components/Home/Home";
import InitScreen from "./components/init/InitScreen";
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
            element: <AddDevice />,
          },
          {
            path: ":deviceId",
            element: <DeviceDetails />,
          },
        ],
      },
      {
        path: "*",
        element: <Home />,
      },
    ],
  },
]);
export default router;
