import { forwardRef } from "react";
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  ViewStyle,
} from "react-native";

import { SxProp } from "@components/theme/sx/sx-types";
import { Box } from "@components/common/box/box";

type TouchableNoFeedbackProps = TouchableWithoutFeedbackProps & {
  sx?: SxProp<ViewStyle>;
};

const TouchableNoFeedback = forwardRef<
  TouchableWithoutFeedback,
  TouchableNoFeedbackProps
>(({ sx, style, children, ...rest }, ref) => (
  <TouchableWithoutFeedback ref={ref} {...rest}>
    <Box sx={sx} style={style}>
      {children}
    </Box>
  </TouchableWithoutFeedback>
));

TouchableNoFeedback.displayName = "TouchableNoFeedback";

export { TouchableNoFeedback };
