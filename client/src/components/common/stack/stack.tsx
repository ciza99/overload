import { ViewProps, ViewStyle } from "react-native";

import { Box } from "@components/common/box/box";
import { SxProp } from "@components/theme/sx/sx-types";

export type StackProps = ViewProps & {
  direction?: "row" | "column";
  justifyContent?: ViewStyle["justifyContent"];
  alignItems?: ViewStyle["alignItems"];
  wrap?: ViewStyle["flexWrap"];
  sx?: SxProp<ViewStyle>;
};

export const Stack = ({
  direction = "row",
  alignItems = "center",
  wrap = "wrap",
  justifyContent = "flex-start",
  sx,
  children,
  ...rest
}: StackProps) => {
  return (
    <Box
      sx={[
        {
          display: "flex",
          flexDirection: direction,
          alignItems,
          flexWrap: wrap,
          justifyContent,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </Box>
  );
};
