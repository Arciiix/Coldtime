import { createBrowserRouter } from "react-router-dom";
import DeviceDetails from "./components/device/DeviceDetails";
import AddDevice from "./components/devices/AddDevice/AddDevice";

import Home from "./components/Home/Home";
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
    path: "*",
    element: <Home />,
  },
]);
export default router;
