import { View, ViewProps } from "react-native";
import cx from "clsx";

export type StackProps = ViewProps & {
  direction?: "row" | "column";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  items?: "start" | "center" | "end" | "stretch" | "baseline";
};

export const Stack = ({
  direction = "row",
  items = "center",
  justify = "center",
  children,
  tw,
  ...rest
}: StackProps) => {
  return (
    <View
      tw={cx(tw, "flex", {
        "flex-row": direction === "row",
        "flex-col": direction === "column",
        "items-start": items === "start",
        "items-center": items === "center",
        "items-end": items === "end",
        "items-stretch": items === "stretch",
        "items-baseline": items === "baseline",
        "justify-start": justify === "start",
        "justify-center": justify === "center",
        "justify-end": justify === "end",
        "justify-between": justify === "between",
        "justify-around": justify === "around",
        "justify-evenly": justify === "evenly",
      })}
      {...rest}
    >
      {children}
    </View>
  );
};
