import { Portal } from "@gorhom/portal";
import clsx from "clsx";
import { forwardRef } from "react";
import { Modal, View, ViewProps, TouchableWithoutFeedback } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
} from "react-native-reanimated";

type PopoverProps = {
  onDismiss?: () => void;
  visible?: boolean;
  showOverlay?: boolean;
} & ViewProps;

export const Popover = forwardRef<View, PopoverProps>(
  (
    { children, onDismiss, visible = true, showOverlay = false, ...props },
    ref
  ) => {
    const style = useAnimatedStyle(() => {
      return {};
    });

    return (
      <Portal>
        <Modal transparent={true} visible={visible} className="grow">
          <TouchableWithoutFeedback onPressIn={onDismiss}>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className={clsx("bg-black/50", { grow: showOverlay })}
            >
              <TouchableWithoutFeedback>
                <View {...props} ref={ref}>
                  {children}
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>
    );
  }
);
