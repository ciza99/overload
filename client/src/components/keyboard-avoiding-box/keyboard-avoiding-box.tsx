import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  ViewStyle,
} from "react-native";

import { forwardRef } from "react";
import { SxProp } from "context/theme/sx/sx-types";
import { useSxStyle } from "context/theme/sx/sx-hook";

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
