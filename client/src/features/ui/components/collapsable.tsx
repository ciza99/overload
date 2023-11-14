import { ReactNode } from "react";
import { View, ViewProps } from "react-native";
import clsx from "clsx";
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
  className,
  style,
  ...rest
}: ViewProps & {
  open: boolean;
  children: ReactNode;
}) => {
  const height = useSharedValue(0);

  const progress = useDerivedValue(
    () => (open ? withSpring(1, { stiffness: 75, mass: 0.85 }) : withTiming(0)),
    [open]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value * progress.value + 1,
    opacity: progress.value === 0 ? 0 : 1,
  }));

  return (
    <Animated.View
      className={clsx("overflow-hidden", className)}
      style={[animatedStyle, style]}
      {...rest}
    >
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
