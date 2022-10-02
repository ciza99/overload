import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  ReactNode,
} from "react";

import { Breakpoint, ThemeConfig } from "./theme-types";

export type Theme = ReturnType<typeof useThemeContext>;

const ThemeContext = createContext<Theme>(undefined as never);

export const useTheme = () => useContext(ThemeContext);

const createMediaQuery = (bound: "min" | "max", width: number) =>
  `(${bound}-width: ${width}px)`;

const useThemeContext = (config: ThemeConfig) => {
  const up = useCallback(
    (breakpoint: Breakpoint) =>
      createMediaQuery("min", config.breakpoints[breakpoint]),
    [config.breakpoints]
  );

  const down = useCallback(
    (breakpoint: Breakpoint) =>
      createMediaQuery("max", config.breakpoints[breakpoint]),
    [config.breakpoints]
  );

  const spacing = useCallback(
    (factor: number) => config.spacing * factor,
    [config.spacing]
  );

  return useMemo(
    () => ({ ...config, spacing, breakpoints: { up, down } }),
    [config, down, spacing, up]
  );
};

export const ThemeProvider = ({
  children,
  config,
}: {
  children: ReactNode;
  config: ThemeConfig;
}) => {
  const themeContext = useThemeContext(config);

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};
