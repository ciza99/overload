import { forwardRef } from "react";
import { ScrollViewProps, ScrollView, ViewStyle } from "react-native";

import { SxProp } from "@components/theme/sx/sx-types";
import { useSxStyle } from "@components/theme/sx/use-sx-style";

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
