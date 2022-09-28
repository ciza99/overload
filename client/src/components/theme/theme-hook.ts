import { useCallback, useMemo } from "react";

import { Breakpoint, Theme, ThemeConfig } from "./theme-types";
import { createMediaQuery } from "./theme-utils";

export const useThemeContext = (config: ThemeConfig): Theme => {
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
