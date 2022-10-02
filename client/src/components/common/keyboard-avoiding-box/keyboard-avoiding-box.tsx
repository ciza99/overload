import { forwardRef } from "react";
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  ViewStyle,
} from "react-native";

import { SxProp } from "@components/theme/sx/sx-types";
import { useSxStyle } from "@components/theme/sx/use-sx-style";

type KeyboardAvoidingBoxProps = KeyboardAvoidingViewProps & {
  sx?: SxProp<ViewStyle>;
};

const KeyboardAvoidingBox = forwardRef<
  KeyboardAvoidingView,
  KeyboardAvoidingBoxProps
>(({ sx, style, ...rest }, ref) => {
  const sxStyle = useSxStyle(sx);

  return <KeyboardAvoidingView ref={ref} style={[sxStyle, style]} {...rest} />;
});

KeyboardAvoidingBox.displayName = "KeyboardAvoidingBox";

export { KeyboardAvoidingBox };
