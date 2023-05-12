import { useStore } from "@components/store/use-store";
import { Portal } from "@gorhom/portal";
import clsx from "clsx";
import { forwardRef, ReactNode, RefObject, useRef } from "react";
import { Modal, View, ViewProps, TouchableWithoutFeedback } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  BounceIn,
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  ZoomIn,
  ZoomOut,
  withSpring,
} from "react-native-reanimated";

// export const usePopover = () => {
//   const aRef = useAnimatedRef<View>();
//   const { open, close } = useStore((state) => state.popover);
//
//   return {
//     ref: aRef,
//     open: <T extends {} = {}>(popover: Omit<Popover<T>, "ref">) =>
//       open({ ref: aRef, ...popover }),
//     close,
//   };
// };

export const usePopover = () => {
  const ref = useRef<View>(null);
  const left = useSharedValue(0);
  const top = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      top: top.value,
      left: left.value,
    };
  });

  const onLayout = () => {
    ref.current?.measure((x, y, width, height, pageX, pageY) => {
      console.log({ x, y, width, height, pageX, pageY });
      left.value = pageX;
      top.value = pageY;
    });
  };

  return {
    referenceProps: {
      ref: ref,
      onLayout,
    },
    popoverProps: {
      style,
    },
  };
};

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
