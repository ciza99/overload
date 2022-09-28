import { ViewProps, ViewStyle } from "react-native";

import { Box } from "components/box/box";
import { SxProp } from "context/theme/sx/sx-types";

export type StackProps = ViewProps & {
  direction?: "row" | "column";
  justifyContent?: ViewStyle["justifyContent"];
  alignItems?: ViewStyle["alignItems"];
  sx?: SxProp<ViewStyle>;
};

export const Stack = ({
  direction = "row",
  alignItems = "center",
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
