import { useMemo } from "react";
import { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { useTheme } from "./theme-context";
import { Theme } from "./theme-types";

type CreateStyleFunction<Props, T> = (props: Props) => T;

type ImageStyleCreateMap<Props> = {
  [K in keyof ImageStyle]:
    | ImageStyle[K]
    | CreateStyleFunction<Props, ImageStyle[K]>;
};

type ViewStyleCreateMap<Props> = {
  [K in keyof ViewStyle]:
    | ViewStyle[K]
    | CreateStyleFunction<Props, ViewStyle[K]>;
};

type TextStyleCreateMap<Props> = {
  [K in keyof TextStyle]:
    | TextStyle[K]
    | CreateStyleFunction<Props, TextStyle[K]>;
};

type StyleCreateMap<Props> =
  | ViewStyleCreateMap<Props>
  | TextStyleCreateMap<Props>
  | ImageStyleCreateMap<Props>;

type CreateStyleMap<Props = object, MapKey extends string = string> = Record<
  MapKey,
  StyleCreateMap<Props>
>;

type StyleMap<MapKey extends string = string> = Record<
  MapKey,
  ViewStyle | TextStyle | ImageStyle
>;

type CreateStyleMapFnc<Props, MapKey extends string> = (
  theme: Theme
) => CreateStyleMap<Props, MapKey>;

const resolveStyleMap = <Props>(
  styleCreateMap: StyleCreateMap<Props>,
  props: Props
) => {
  const entries = Object.entries(styleCreateMap);

  return entries.reduce<ViewStyle | TextStyle | ImageStyle>(
    (acc, [key, styleFactory]) => {
      const value =
        styleFactory instanceof Function ? styleFactory(props) : styleFactory;
      return { ...acc, [key]: value };
    },
    {}
  );
};

type UseStylesType<Props, MapKey extends string> = keyof Props extends never
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props?: any) => StyleMap<MapKey>
  : (props: Props) => StyleMap<MapKey>;

export const makeStyles =
  <Props = object, MapKey extends string = string>(
    createStyleMapFactory: CreateStyleMapFnc<Props, MapKey>
  ): UseStylesType<Props, MapKey> =>
  (props: Props) => {
    const theme = useTheme();

    const createStyleMap = useMemo(() => createStyleMapFactory(theme), [theme]);

    const namedStyleMap = useMemo(() => {
      const entries = Object.entries<StyleCreateMap<Props>>(createStyleMap);

      return entries.reduce<StyleMap<MapKey>>((acc, [key, createStyleMap]) => {
        const styleMap = resolveStyleMap(createStyleMap, props);

        return { ...acc, [key]: styleMap };
      }, {} as StyleMap<MapKey>);
    }, [createStyleMap, props]);

    return namedStyleMap;
  };
