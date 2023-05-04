import { ReactNode } from "react";
import { View } from "react-native";
import Animated, {
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

  const progress = useDerivedValue(
    () => (open ? withSpring(1) : withTiming(0)),
    [open]
  );

  const style = useAnimatedStyle(() => ({
    height: height.value * progress.value + 1,
    opacity: progress.value === 0 ? 0 : 1,
  }));

  return (
    <Animated.View className="overflow-hidden" style={style}>
      <View
        onLayout={({ nativeEvent }) => {
          height.value = nativeEvent.layout.height;
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
};
