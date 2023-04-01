import { createBrowserRouter } from "react-router-dom";
import DeviceDetails from "./components/device/DeviceDetails";
import AddDevice from "./components/devices/AddDevice/AddDevice";

import Home from "./components/Home/Home";
import InitScreen from "./components/init/InitScreen";
const router = createBrowserRouter([
  {
    path: "device",
    children: [
      {
        path: "add",
        element: <AddDevice />,
      },
      {
        path: ":id",
        element: <DeviceDetails />,
      },
    ],
  },
  {
    path: "init",
    element: <InitScreen />,
  },
  {
    path: "*",
    element: <Home />,
  },
]);
export default router;
