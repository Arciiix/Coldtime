import { Box, ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { RouterProvider } from "react-router";
import { RecoilRoot } from "recoil";
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
          <Box>
            <RouterProvider router={router} />
          </Box>
        </ConfirmationDialogProvider>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
