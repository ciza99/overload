import { ReactNode, useEffect } from "react";
import { View } from "react-native";
import Animated, {
  measure,
  runOnUI,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const Collapsable = ({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) => {
  const height = useSharedValue(0);
  const aRef = useAnimatedRef<View>();

  const progress = useDerivedValue(
    () => (open ? withSpring(1) : withTiming(0)),
    [open]
  );

  useEffect(() => {
    runOnUI(() => {
      "worklet";
      height.value = measure(aRef)?.height ?? 0;
    })();
  }, [open]);

  const style = useAnimatedStyle(
    () => ({
      height: height.value * progress.value + 1,
      opacity: progress.value === 0 ? 0 : 1,
    }),
    [open]
  );

  return (
    <Animated.View className="overflow-hidden" style={style}>
      <View ref={aRef}>{children}</View>
    </Animated.View>
  );
};
