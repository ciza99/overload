import { Text, TextProps } from "react-native";
import clsx from "clsx";

export type TypographyProps = TextProps & {
  className?: string;
  weight?: "light" | "regular" | "medium" | "semibold" | "bold" | "extrabold";
};

export const Typography = ({
  children,
  className,
  weight = "medium",
  ...rest
}: TypographyProps) => (
  <Text
    className={clsx(
      "text-white",
      {
        "font-poppins-light": weight === "light",
        "font-poppins-regular": weight === "regular",
        "font-poppins-medium": weight === "medium",
        "font-poppins-semi-bold": weight === "semibold",
        "font-poppins-bold": weight === "bold",
        "font-poppins-extra-bold": weight === "extrabold",
      },
      className
    )}
    {...rest}
  >
    {children}
  </Text>
);
