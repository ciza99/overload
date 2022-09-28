import { useMemo } from "react";

import { Falsy } from "types/common";

import { useTheme } from "../theme-context";
import { Theme } from "../theme-types";
import { transformations } from "./sx-constants";
import { AnyStyle, SxProp, SxStyle } from "./sx-types";

const applyThemeStyles = <Style extends AnyStyle>(
  style: SxStyle<Style>,
  theme: Theme
): Style =>
  Object.entries(style).reduce((acc, entry) => {
    const [key, value] = entry as [
      keyof typeof transformations,
      SxStyle<Style>
    ];
    const transformation = transformations[key];

    if (!transformation) {
      return { ...acc, [key]: value };
    }

    const newValue = transformation({ key, value, theme } as never);

    if (
      typeof newValue === "object" &&
      !Array.isArray(newValue) &&
      newValue !== null
    ) {
      return { ...acc, ...newValue };
    }

    return { ...acc, [key]: newValue };
  }, {} as Style);

const traverseSxProp = <Style extends AnyStyle>(
  sxProp: SxProp<Style>,
  theme: Theme
): Style | Falsy => {
  if (!sxProp) {
    return sxProp;
  }

  if (!Array.isArray(sxProp) && !(sxProp instanceof Function)) {
    return applyThemeStyles(sxProp, theme);
  }

  if (!Array.isArray(sxProp)) {
    return traverseSxProp(sxProp(theme), theme);
  }

  return sxProp.reduce<Style>(
    (acc, subSxProp) => ({ ...acc, ...traverseSxProp(subSxProp, theme) }),
    {} as Style
  );
};

export const useSxStyle = <Style extends AnyStyle>(
  sxProp?: SxProp<Style>
): Style | Falsy => {
  const theme = useTheme();

  return useMemo(() => traverseSxProp(sxProp, theme), [sxProp, theme]);
};
