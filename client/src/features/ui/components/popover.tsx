import { forwardRef } from "react";
import { Modal, TouchableWithoutFeedback, View, ViewProps } from "react-native";
import { Portal } from "@gorhom/portal";
import clsx from "clsx";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

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

Popover.displayName = "Popover";
