import { StyleProp, View, ViewStyle } from "react-native";
import clsx from "clsx";

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
      "bg-base-500 rounded-lg",
      {
        "w-full": direction === "horizontal",
        "h-full": direction === "vertical",
        rounded,
      },
      className
    )}
    style={[
      direction === "horizontal" && { height: thickness },
      direction === "vertical" && { width: thickness },
      style,
    ]}
  />
);
