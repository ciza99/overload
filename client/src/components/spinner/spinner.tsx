import { animated, useSpring } from "@react-spring/native";
import { StyleProp, ViewStyle } from "react-native";

import { Box } from "components/box/box";
import { SxProp } from "context/theme/sx/sx-types";
import { Theme } from "context/theme/theme-types";

type Props = {
  scale?: number;
  color?: keyof Theme["palette"];
  sx?: SxProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

const AnimatedBox = animated(Box);

export const Spinner = ({ color = "primary", scale = 1, sx, style }: Props) => {
  const { rotate } = useSpring({
    from: {
      rotate: "0deg",
    },
    to: {
      rotate: "360deg",
    },
    loop: true,
    config: {
      mass: 1,
      tension: 100,
      friction: 20,
    },
  });

  return (
    <AnimatedBox
      sx={[
        (theme) => ({
          borderBottomWidth: scale * theme.spacing(1),
          borderLeftWidth: scale * theme.spacing(1),
          borderTopWidth: scale * theme.spacing(1),
          borderRightWidth: scale * theme.spacing(1),
          borderBottomColor: theme.palette[color],
          borderRightColor: "rgba(0,0,0,0)",
          borderLeftColor: theme.palette[color],
          borderTopColor: theme.palette[color],
          borderRadius: 500,
          height: scale * theme.spacing(5),
          width: scale * theme.spacing(5),
        }),
        sx,
      ]}
      style={[{ transform: [{ rotate }] }, style]}
    />
  );
};
