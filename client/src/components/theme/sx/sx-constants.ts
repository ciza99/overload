import { FlexStyle } from "react-native";

import {
  AnyStyle,
  SizingPropKey,
  TransformationProps,
  StyleTransformations,
} from "./sx-types";

const sizingKeyMap: Record<SizingPropKey, keyof FlexStyle> = {
  m: "margin",
  ml: "marginLeft",
  mt: "marginTop",
  mr: "marginRight",
  mb: "marginBottom",
  mx: "marginHorizontal",
  my: "marginVertical",
  p: "padding",
  pl: "paddingLeft",
  pt: "paddingTop",
  pr: "paddingRight",
  pb: "paddingBottom",
  px: "marginHorizontal",
  py: "paddingVertical",
};

const sizingTransformation = <Key extends SizingPropKey>({
  key,
  value,
  theme,
}: TransformationProps<AnyStyle, Key>) => ({
  [sizingKeyMap[key]]: typeof value === "number" ? theme.spacing(value) : value,
});

const spaceTransformation = <Key extends keyof FlexStyle>({
  value,
}: TransformationProps<FlexStyle, Key>) =>
  typeof value === "number" && value <= 1 && value !== 0
    ? `${value * 100}%`
    : value;

export const transformations: StyleTransformations = {
  m: sizingTransformation,
  ml: sizingTransformation,
  mt: sizingTransformation,
  mr: sizingTransformation,
  mb: sizingTransformation,
  mx: sizingTransformation,
  my: sizingTransformation,
  p: sizingTransformation,
  pl: sizingTransformation,
  pt: sizingTransformation,
  pr: sizingTransformation,
  pb: sizingTransformation,
  px: sizingTransformation,
  py: sizingTransformation,
  width: spaceTransformation,
  minWidth: spaceTransformation,
  maxWidth: spaceTransformation,
  height: spaceTransformation,
  minHeight: spaceTransformation,
  maxHeight: spaceTransformation,
};
