import { forwardRef } from "react";
import { View, ViewProps, ViewStyle } from "react-native";

import { SxProp } from "@components/theme/sx/sx-types";
import { useSxStyle } from "@components/theme/sx/use-sx-style";

type BoxProps = ViewProps & {
  sx?: SxProp<ViewStyle>;
};

const Box = forwardRef<View, BoxProps>(({ sx, style, ...rest }, ref) => {
  const sxStyle = useSxStyle(sx);

  return <View ref={ref} style={[sxStyle, style]} {...rest} />;
});

Box.displayName = "Box";

export { Box };
