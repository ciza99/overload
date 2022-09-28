import { ScrollViewProps, ScrollView, ViewStyle } from "react-native";

import { forwardRef } from "react";
import { SxProp } from "context/theme/sx/sx-types";
import { useSxStyle } from "context/theme/sx/sx-hook";

type ScrollBoxProps = ScrollViewProps & {
  sx?: SxProp<ViewStyle>;
};

const ScrollBox = forwardRef<ScrollView, ScrollBoxProps>(
  ({ sx, style, ...rest }, ref) => {
    const sxStyle = useSxStyle(sx);

    return <ScrollView ref={ref} style={[sxStyle, style]} {...rest} />;
  }
);

ScrollBox.displayName = "ScrollBox";

export { ScrollBox };
