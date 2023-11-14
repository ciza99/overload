import { View } from "react-native";
import { useFormContext } from "react-hook-form";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  interpolateColor,
  Layout,
  runOnJS,
  SlideInLeft,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useIsFirstRender } from "@features/core/hooks/use-is-first-render";
import { TextField, Typography } from "@features/ui/components";
import { colors } from "@features/ui/theme";

import { SessionFormType, SetFormType } from "../../types/training";

const swipeThreshold = 100;

export const Set = ({
  set,
  setIndex,
  exerciseIndex,
  removeSelf,
  setsLength,
  removeExercise,
}: {
  set: SetFormType;
  exerciseIndex: number;
  setIndex: number;
  removeSelf: () => void;
  setsLength: number;
  removeExercise: () => void;
}) => {
  const { control } = useFormContext<SessionFormType>();
  const isFirstRender = useIsFirstRender();
  const animateEntrance = !isFirstRender || setsLength !== 1;
  // TODO: remove on swipe left and check on swipe right if in training
  const tx = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .onStart(() => {
      console.log("drag start");
    })
    .onUpdate(({ translationX }) => {
      tx.value = translationX;
    })
    .onEnd(({ translationX }) => {
      tx.value = withSpring(0);
      if (translationX > swipeThreshold) {
        //TODO
      }
      if (translationX < -swipeThreshold) {
        runOnJS(setsLength === 1 ? removeExercise : removeSelf)();
      }
    });

  const rowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tx.value }],
    };
  });
  const backgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        tx.value,
        [-swipeThreshold, 0, swipeThreshold],
        [0.5, 0, 0.5]
      ),
      backgroundColor: interpolateColor(
        tx.value,
        [-swipeThreshold, 0, swipeThreshold],
        [colors.danger, colors.base[700], colors.primary]
      ),
    };
  });

  return (
    <Animated.View
      entering={animateEntrance ? SlideInLeft : undefined}
      exiting={SlideOutLeft}
      layout={Layout}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View className="relative mb-2">
          <Animated.View
            style={backgroundStyle}
            className="absolute -bottom-1 -left-full -right-full -top-1 bg-danger"
          />
          <Animated.View
            className=" flex flex-row items-center justify-stretch"
            style={rowStyle}
          >
            <View className="flex-[1] rounded-lg">
              <View className="rounded-lg bg-base-600">
                <Typography className="py-2 text-center">{setIndex}</Typography>
              </View>
            </View>
            <View className="flex-[3] rounded-lg">
              <View className="rounded-lg">
                <Typography className="py-2 text-center">no data</Typography>
              </View>
            </View>
            <View className="flex-[3] rounded-lg">
              <TextField
                control={control}
                name={`exercises.${exerciseIndex}.sets.${setIndex}.weight`}
                maxLength={6}
                className="ml-3"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-[3] rounded-lg">
              <TextField
                control={control}
                maxLength={6}
                name={`exercises.${exerciseIndex}.sets.${setIndex}.reps`}
                className="ml-3"
                keyboardType="number-pad"
              />
            </View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};
