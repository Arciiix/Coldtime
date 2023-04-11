import { extendTheme } from "@chakra-ui/react";

// 2. Add your color mode config
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({ config });

export default theme;

// DEV
localStorage.setItem("chakra-ui-color-mode", "dark");

export const CHART_GREEN = "#00FF00";
export const CHART_RED = "#FF0000";
export const CHART_GRAY = "#808080";
