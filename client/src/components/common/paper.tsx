import clsx from "clsx";
import React, { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

type PaperProps = {
  children?: ReactNode;
  elevation?: 1 | 2 | 3 | 4;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export const Paper = ({
  elevation = 1,
  children,
  className,
  style,
}: PaperProps) => {
  return (
    <View
      className={clsx(
        "rounded",
        {
          "bg-base-700": elevation === 1,
          "bg-base-600": elevation === 2,
          "bg-base-500": elevation === 3,
          "bg-base-400": elevation === 4,
        },
        className
      )}
      style={style}
    >
      {children}
    </View>
  );
};
