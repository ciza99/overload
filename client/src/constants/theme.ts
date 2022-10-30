import resolveConfig from "tailwindcss/resolveConfig";
import { ThemeConfig } from "tailwindcss/types/config";

import config from "../../tailwind.config";

const theme = resolveConfig(config).theme as ThemeConfig;
export const colors = theme.colors instanceof Function ? {} : theme.colors;
