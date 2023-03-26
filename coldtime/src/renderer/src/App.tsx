import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { RouterProvider } from "react-router";
import { RecoilRoot } from "recoil";
import AppBar from "./components/UI/AppBar";
import router from "./router";
import theme from "./theme";
const { ipcRenderer } = window.require("electron");

function App(): JSX.Element {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <AppBar />
        <RouterProvider router={router} />
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
