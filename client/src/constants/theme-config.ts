import { neutral } from "context/theme/colors/colors";
import { ThemeConfig } from "context/theme/theme-types";

export const themeConfig: ThemeConfig = {
  breakpoints: {
    xs: 240,
    sm: 320,
    md: 400,
    lg: 480,
  },
  palette: {
    primary: "#429A95",
    secondary: "#429A95",
    text: "white",
    background: "#191A1C",
    paper: neutral[800],
    divider: "rgba(255, 255, 255, 0.5)",
    muted: "rgba(255, 255, 255, 0.5)",
    danger: "#d13f34",
  },
  mode: "dark",
  shape: {
    borderRadius: 4,
  },
  spacing: 4,
  typography: {
    title1: {
      fontSize: 32,
      fontFamily: "Poppins_500Medium",
    },
    title1Bold: {
      fontSize: 32,
      fontFamily: "Poppins_700Bold",
    },
    title2: {
      fontSize: 26,
      fontFamily: "Poppins_500Medium",
    },
    title3: {
      fontSize: 22,
      fontFamily: "Poppins_400Regular",
    },
    headline: {
      fontSize: 17,
      fontFamily: "Poppins_700Bold",
    },
    body1: {
      fontSize: 15,
      fontFamily: "Poppins_400Regular",
    },
    body2: {
      fontSize: 13,
      fontFamily: "Poppins_400Regular",
    },
    button: {
      fontSize: 15,
      fontFamily: "Poppins_700Bold",
    },
    caption: {
      fontSize: 11,
      fontFamily: "Poppins_400Regular",
    },
  },
};
