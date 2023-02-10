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
        "font-poppinsLight": weight === "light",
        "font-poppinsRegular": weight === "regular",
        "font-poppinsMedium": weight === "medium",
        "font-poppinsSemiBold": weight === "semibold",
        "font-poppinsBold": weight === "bold",
        "font-poppinsExtraBold": weight === "extrabold",
      },
      className
    )}
    {...rest}
  >
    {children}
  </Text>
);
