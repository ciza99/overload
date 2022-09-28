import { TextStyle } from "react-native";

export type Breakpoint = "xs" | "sm" | "md" | "lg";

export type ThemeConfig = {
  spacing: number;
  palette: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
    paper: string;
    divider: string;
    muted: string;
    danger: string;
  };
  shape: {
    borderRadius: number;
  };
  mode: "dark" | "light";
  typography: {
    title1: TextStyle;
    title1Bold: TextStyle;
    title2: TextStyle;
    title3: TextStyle;
    headline: TextStyle;
    body1: TextStyle;
    body2: TextStyle;
    button: TextStyle;
    caption: TextStyle;
  };
  breakpoints: {
    [Key in Breakpoint]: number;
  };
};

type BreakpointFnc = (breakpoint: Breakpoint) => string;

export type Theme = Omit<ThemeConfig, "spacing" | "breakpoints"> & {
  spacing: (factor: number) => number;
  breakpoints: {
    up: BreakpointFnc;
    down: BreakpointFnc;
  };
};
