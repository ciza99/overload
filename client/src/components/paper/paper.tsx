import { ReactNode, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { Box } from "components/box/box";
import { SxProp } from "context/theme/sx/sx-types";

type PaperProps = {
  children?: ReactNode;
  elevation?: 1 | 2 | 3 | 4;
  sx?: SxProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export const Paper = ({ elevation = 1, children, sx, style }: PaperProps) => {
  const backgroundColor = useMemo(
    () => `rgba(255, 255, 255, ${elevation / 20})`,
    [elevation]
  );

  return (
    <Box
      sx={[
        (theme) => ({
          backgroundColor,
          borderRadius: theme.shape.borderRadius,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      style={style}
    >
      {children}
    </Box>
  );
};
