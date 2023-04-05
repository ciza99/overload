import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

type Props = Omit<ComponentProps<typeof Ionicons>, "size"> & {
  size?: Size | number;
};
type Size = "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
};

export const Icon = ({ size = "md", ...props }: Props) => {
  return (
    <Ionicons {...props} size={typeof size === "string" ? sizes[size] : size} />
  );
};
