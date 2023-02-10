import clsx from "clsx";
import React, { ReactNode, useMemo } from "react";
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
  const backgroundColor = useMemo(
    () => `rgba(255, 255, 255, ${elevation / 20})`,
    [elevation]
  );

  return (
    <View
      className={clsx("rounded", className)}
      style={[{ backgroundColor }, style]}
    >
      {children}
    </View>
  );
};
