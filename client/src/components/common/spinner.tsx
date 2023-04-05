import clsx from "clsx";
import { useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from "react-native-reanimated";

type Props = {
  style?: StyleProp<ViewStyle>;
  color?: "primary" | "white";
  className?: string;
};

export const Spinner = ({ style, color = "primary", className }: Props) => {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withSpring(360, {
        damping: 20,
        stiffness: 100,
        mass: 1,
        restDisplacementThreshold: 0.2,
      }),
      -1
    );

    () => cancelAnimation(rotate);
  }, []);

  const aStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotate.value}deg`,
      },
    ],
  }));

  return (
    <Animated.View
      className={clsx(
        "!border-l-transparent rounded-full border-4 w-5 h-5",
        {
          "border-t-primary border-r-primary border-b-primary":
            color === "primary",
          "border-t-white border-r-white border-b-white": color === "white",
        },
        className
      )}
      style={[aStyle, style]}
    />
  );
};
