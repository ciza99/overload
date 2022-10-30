import { View, ViewProps } from "react-native";
import cx from "clsx";

type DividerProps = ViewProps & {
  thickness?: number;
  direction?: "horizontal" | "vertical";
  rounded?: boolean;
};

export const Divider = ({
  direction = "horizontal",
  rounded = false,
  style,
  tw,
}: DividerProps) => (
  <View
    tw={cx(tw, "bg-divider border", {
      "rounded-full": rounded,
      "w-full": direction === "horizontal",
      "h-full": direction === "vertical",
    })}
    style={style}
  />
);
