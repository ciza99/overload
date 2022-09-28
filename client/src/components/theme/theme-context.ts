import { createContext, useContext } from "react";

import { Theme } from "./theme-types";

export const ThemeContext = createContext<Theme>(undefined as never);

export const useTheme = () => useContext(ThemeContext);
