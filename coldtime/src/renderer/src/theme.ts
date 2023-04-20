import { extendTheme } from "@chakra-ui/react";

// 2. Add your color mode config
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({ config });

export default theme;

// Override the Chakra UI color mode
localStorage.setItem("chakra-ui-color-mode", "dark");

export const CHART_GREEN = "#005900";
export const CHART_RED = "#8c0023";
export const CHART_GRAY = "#808080";
