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
          <Box
            h="100vh"
            w="100vw"
            bgImage="radial-gradient(at 47% 33%, hsl(233.85, 59%, 13%) 0, transparent 59%), 
            radial-gradient(at 82% 65%, hsl(163.33, 40%, 9%) 0, transparent 55%);"
          >
            <RouterProvider router={router} />
          </Box>
        </ConfirmationDialogProvider>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
