import { RefObject } from "react";
import { View } from "react-native";
import { useFieldArray, useFormContext } from "react-hook-form";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";

import {
  BottomSheetModalType,
  Button,
  Icon,
  Typography,
} from "@features/ui/components";
import { useSortable } from "@features/ui/components/dnd";
import { colors } from "@features/ui/theme";

import { ExerciseFormType, SessionFormType } from "../../types/training";
import { Set } from "./set";

export const Exercise = ({
  id,
  exercise,
  exerciseIndex,
  removeSelf,
  exerciseActionsBottomSheet,
  reordering,
}: {
  id: string;
  exercise: ExerciseFormType;
  exerciseIndex: number;
  removeSelf: () => void;
  exerciseActionsBottomSheet: RefObject<BottomSheetModalType>;
  reordering: boolean;
}) => {
  const { control } = useFormContext<SessionFormType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });
  const { refs, style, panGesture } = useSortable(id);

  return (
    <Animated.View
      className="mb-5"
      entering={FadeIn}
      exiting={FadeOut}
      layout={Layout}
      ref={refs.droppable}
      style={style}
    >
      <Animated.View ref={refs.draggable}>
        <GestureDetector gesture={panGesture.enabled(reordering)}>
          <View className="mb-2 flex flex-row items-center">
            {reordering && (
              <Animated.View
                className="mr-2"
                entering={SlideInLeft}
                exiting={SlideOutLeft}
              >
                <Icon color={colors.primary} name="reorder-three-outline" />
              </Animated.View>
            )}
            <Animated.View layout={Layout} className="mr-auto">
              <Typography weight="bold" className="text-lg">
                {exercise.name}
              </Typography>
            </Animated.View>
            {!reordering && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <Icon
                  color="white"
                  name="ellipsis-horizontal-outline"
                  onPress={() =>
                    exerciseActionsBottomSheet.current?.present(exerciseIndex)
                  }
                />
              </Animated.View>
            )}
          </View>
        </GestureDetector>
        {!reordering && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <View className="mb-4 flex flex-row">
              <View className="flex-[1]">
                <Typography weight="bold" className="text-center">
                  Set
                </Typography>
              </View>
              <View className="flex-[3]">
                <Typography weight="bold" className="text-center">
                  Previous
                </Typography>
              </View>
              <View className="flex-[3]">
                <Typography weight="bold" className="text-center">
                  Kg
                </Typography>
              </View>
              <View className="flex-[3]">
                <Typography weight="bold" className="text-center">
                  Reps
                </Typography>
              </View>
            </View>
            {!fields.length && (
              <View className="mb-4 rounded-lg bg-base-700 p-2">
                <Typography weight="bold" className="text-center text-base-300">
                  No sets
                </Typography>
              </View>
            )}
            {fields.map((set, setIndex) => (
              <Set
                key={set.id}
                set={set}
                setIndex={setIndex}
                exerciseIndex={exerciseIndex}
                setsLength={fields.length}
                removeSelf={() => remove(setIndex)}
                removeExercise={removeSelf}
              />
            ))}
            <Animated.View layout={Layout}>
              <Button
                variant="primary"
                beforeIcon={<Icon color="white" name="add-outline" />}
                className="bg-base-600"
                onPress={() =>
                  append({ reps: "", weight: "", completed: false })
                }
              >
                Add set
              </Button>
            </Animated.View>
          </Animated.View>
        )}
      </Animated.View>
    </Animated.View>
  );
};
