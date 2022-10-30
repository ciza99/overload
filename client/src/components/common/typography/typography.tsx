import { Text, TextProps } from "react-native";
import cx from "clsx";

export type TypographyProps = TextProps & {
  variant?: "title1" | "title2" | "title3" | "body" | "caption";
  weight?: "regular" | "medium" | "semibold" | "bold";
};

export const Typography = ({
  variant = "body",
  weight = "regular",
  tw,
  children,
  style,
  ...rest
}: TypographyProps) => {
  return (
    <Text
      tw={cx(tw, "dark:text-white", {
        "text-4xl": variant === "title1",
        "text-3xl": variant === "title2",
        "text-2xl": variant === "title3",
        "text-sm": variant === "caption",
        "font-poppins-medium": weight === "medium",
        "font-poppins-semibold": weight === "semibold",
        "font-poppins-bold": weight === "bold",
        "font-poppins-regular": weight === "regular",
      })}
      {...rest}
    >
      {children}
    </Text>
  );
};
