import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { RouterProvider } from "react-router";
import { RecoilRoot } from "recoil";
import AppBar from "./components/UI/AppBar";
import {
  ConfirmationDialog,
  ConfirmationDialogProvider,
} from "./context/confirmationDialogContext";
import router from "./router";
import theme from "./theme";
// const { ipcRenderer } = window.require("electron");

function App(): JSX.Element {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ConfirmationDialogProvider>
          <ConfirmationDialog />
          {/* <AppBar /> */}
          <RouterProvider router={router} />
        </ConfirmationDialogProvider>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
