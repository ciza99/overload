import { FC, useState } from "react";
import { BottomTabBar, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { TrainingBottomSheet } from "@features/training/components/training-bottom-sheet";

export const TabBar: FC<BottomTabBarProps> = (props) => {
  const [height, setHeight] = useState<number>();
  const animatedIndex = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            animatedIndex.value,
            [-1, 0, 1],
            [0, 0, height ?? 0]
          ),
        },
      ],
      opacity: interpolate(animatedIndex.value, [0, 1], [1, 0]),
    };
  }, [height]);

  return (
    <>
      <TrainingBottomSheet
        snapPointOffset={height}
        animatedIndex={animatedIndex}
      />
      <Animated.View
        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
        className="absolute bottom-0 left-0 right-0"
        style={style}
      >
        <BottomTabBar {...props} />
      </Animated.View>
    </>
  );
};
