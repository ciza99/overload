import { View } from "react-native";
import { useFormContext, useWatch } from "react-hook-form";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  Layout,
  runOnJS,
  SlideInLeft,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useIsFirstRender } from "@features/core/hooks/use-is-first-render";
import { clamp } from "@features/core/lib/worklets";
import { TextField, Typography } from "@features/ui/components";
import { colors } from "@features/ui/theme";

import { SessionFormType, SetFormType } from "../../types/training";

const swipeThreshold = 100;

export const Set = ({
  setIndex,
  exerciseIndex,
  removeSelf,
  setsLength,
  removeExercise,
  disableCompletion,
}: {
  set: SetFormType;
  exerciseIndex: number;
  setIndex: number;
  removeSelf: () => void;
  setsLength: number;
  removeExercise: () => void;
  disableCompletion?: boolean;
}) => {
  const { control, setValue } = useFormContext<SessionFormType>();
  const isFirstRender = useIsFirstRender();
  const animateEntrance = !isFirstRender || setsLength !== 1;
  // TODO: remove on swipe left and check on swipe right if in training
  const completed = useWatch({
    name: `exercises.${exerciseIndex}.sets.${setIndex}.completed`,
    control,
  });

  const toggleCompleted = () =>
    setValue(
      `exercises.${exerciseIndex}.sets.${setIndex}.completed`,
      !completed
    );

  const tx = useSharedValue(0);
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate(({ translationX }) => {
      tx.value = translationX;
    })
    .onEnd(({ translationX }) => {
      tx.value = withTiming(0);
      if (translationX > swipeThreshold && !disableCompletion) {
        runOnJS(toggleCompleted)();
      }
      if (translationX < -swipeThreshold) {
        runOnJS(setsLength === 1 ? removeExercise : removeSelf)();
      }
    });

  const rowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: clamp(
            tx.value,
            -Infinity,
            disableCompletion ? 0 : Infinity
          ),
        },
      ],
    };
  });

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        tx.value,
        [-swipeThreshold, 0, swipeThreshold],
        [0.5, 0, disableCompletion ? 0 : 0.5],
        Extrapolation.CLAMP
      ),
      backgroundColor: interpolateColor(
        tx.value,
        [-swipeThreshold, 0, swipeThreshold],
        [colors.danger, colors.primary, colors.primary]
      ),
    };
  }, [completed]);

  const borderColor = completed ? colors.primary : "rgba(0,0,0,0)";

  const borderStyle = useAnimatedStyle(() => {
    return {
      borderColor,
    };
  }, [borderColor]);

  return (
    <Animated.View
      entering={animateEntrance ? SlideInLeft : undefined}
      exiting={SlideOutLeft}
      layout={Layout}
      className="overflow-visible"
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View className="relative mb-2 overflow-visible">
          <Animated.View
            style={backgroundStyle}
            className="absolute -bottom-1 -left-full -right-full -top-1"
          />
          <Animated.View
            className="justify-stretch flex flex-row items-center"
            style={rowStyle}
          >
            <View className="flex-[1] rounded-lg">
              <Animated.View
                style={borderStyle}
                className="rounded-lg border bg-base-600"
              >
                <Typography className="py-2 text-center">
                  {setIndex + 1}
                </Typography>
              </Animated.View>
            </View>
            <View className="flex-[3] rounded-lg">
              <View className="rounded-lg">
                <Typography className="py-2 text-center">no data</Typography>
              </View>
            </View>
            <View className="flex-[3] rounded-lg">
              <TextField
                borderColor={borderColor}
                activeBorderColor={completed ? colors.primary : undefined}
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
                borderColor={borderColor}
                activeBorderColor={completed ? colors.primary : undefined}
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
