import { ReactNode } from "react";

import { ThemeContext } from "./theme-context";
import { useThemeContext } from "./theme-hook";
import { ThemeConfig } from "./theme-types";

type ThemeProviderProps = {
  children: ReactNode;
  config: ThemeConfig;
};

export const ThemeProvider = ({ children, config }: ThemeProviderProps) => {
  const themeContext = useThemeContext(config);

  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  );
};
