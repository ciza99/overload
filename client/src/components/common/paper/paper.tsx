import cx from "clsx";
import { ReactNode, useMemo } from "react";
import { View, ViewStyle } from "react-native";

type PaperProps = {
  children?: ReactNode;
  elevation?: 1 | 2 | 3 | 4;
  style?: ViewStyle;
  tw?: string;
};

export const Paper = ({ elevation = 1, children, tw, style }: PaperProps) => {
  const backgroundColor = useMemo(
    () => `rgba(255, 255, 255, ${elevation / 20})`,
    [elevation]
  );

  return (
    <View tw={cx(tw, "rounded")} style={[{ backgroundColor }, style]}>
      {children}
    </View>
  );
};
