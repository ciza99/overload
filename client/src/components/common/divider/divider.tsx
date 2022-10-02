import { StyleProp, ViewStyle } from "react-native";

import { SxProp } from "@components/theme/sx/sx-types";

import { Box } from "../box/box";

type DividerProps = {
  thickness?: number;
  direction?: "horizontal" | "vertical";
  rounded?: boolean;
  sx?: SxProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export const Divider = ({
  thickness = 1,
  direction = "horizontal",
  rounded = false,
  sx,
  style,
}: DividerProps) => (
  <Box
    sx={[
      (theme) => ({
        borderColor: theme.palette.divider,
        borderWidth: thickness,
      }),
      direction === "horizontal" && {
        width: 1,
      },
      direction === "vertical" && {
        height: 1,
      },
      rounded &&
        ((theme) => ({
          borderRadius: theme.shape.borderRadius,
        })),
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
    style={style}
  />
);
