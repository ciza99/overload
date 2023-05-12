import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Typography } from "./typography";

type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Props = Omit<ComponentProps<typeof Ionicons>, "size"> & {
  size?: Size | number;
  typographyClassName?: string;
};

const sizes: Record<Size, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
};

export const Icon = ({ size = "md", typographyClassName, ...props }: Props) => {
  return (
    <Typography className={typographyClassName}>
      <Ionicons
        {...props}
        size={typeof size === "string" ? sizes[size] : size}
      />
    </Typography>
  );
};
