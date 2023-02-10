import clsx from "clsx";
import { StyleProp, View, ViewStyle } from "react-native";

type DividerProps = {
  thickness?: number;
  direction?: "horizontal" | "vertical";
  rounded?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
};

export const Divider = ({
  thickness = 1,
  direction = "horizontal",
  rounded = false,
  style,
  className,
}: DividerProps) => (
  <View
    className={clsx(
      "border-divider rounded",
      {
        "w-full h-0": direction === "horizontal",
        "h-full w-0": direction === "vertical",
        rounded,
      },
      className
    )}
    style={[{ borderWidth: thickness }, style]}
  />
);
