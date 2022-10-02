import { ImageStyle, TextStyle, ViewStyle } from "react-native";

import { Falsy } from "@src/types/common";

import { Theme } from "..";

export type AnyStyle = ViewStyle | TextStyle | ImageStyle;

type SxFunction<TStyle extends AnyStyle> = (theme: Theme) => SxStyle<TStyle>;

type SxArray<TStyle extends AnyStyle> = Array<
  Falsy | SxStyle<TStyle> | SxFunction<TStyle>
>;

export type SxProp<TStyle extends AnyStyle> =
  | Falsy
  | SxStyle<TStyle>
  | SxFunction<TStyle>
  | SxArray<TStyle>;

export type SizingPropKey =
  | "m"
  | "mt"
  | "mr"
  | "mb"
  | "ml"
  | "mx"
  | "my"
  | "p"
  | "pt"
  | "pr"
  | "pb"
  | "pl"
  | "px"
  | "py";

type SizingProps<TValue = number | string | undefined> = {
  [Key in SizingPropKey]?: TValue;
};

export type SxStyle<TStyle extends AnyStyle> = TStyle & SizingProps;

// ------------------------
// Transformations to style
// ------------------------

export type TransformationProps<
  TStyle extends AnyStyle,
  TKey extends keyof SxStyle<TStyle>
> = {
  key: TKey;
  value: SxStyle<TStyle>[TKey];
  theme: Theme;
};

export type TransformationReturnType<
  TStyle extends AnyStyle,
  TKey extends keyof SxStyle<TStyle>
> = TKey extends keyof TStyle ? TStyle[TKey] | TStyle : TStyle;

type StyleTransformation<
  TStyle extends AnyStyle,
  TKey extends keyof SxStyle<TStyle>
> = (
  props: TransformationProps<TStyle, TKey>
) => TransformationReturnType<TStyle, TKey>;

export type StyleTransformations = {
  [Key in keyof SxStyle<AnyStyle>]?: StyleTransformation<AnyStyle, Key>;
};
