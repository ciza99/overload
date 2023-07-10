import {
  BottomSheetModalType,
  Button,
  Icon,
  Typography,
} from "@components/common";
import { RefObject } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";
import { ExerciseFormType, SessionFormType } from "./types";
import { Set } from "./set";
import { useSortable } from "@components/common/dnd";
import { GestureDetector } from "react-native-gesture-handler";
import { colors } from "@constants/theme";

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
      className="mb-4"
      entering={FadeIn}
      exiting={FadeOut}
      layout={Layout}
      ref={refs.droppable}
      style={style}
    >
      <Animated.View ref={refs.draggable}>
        <GestureDetector gesture={panGesture.enabled(reordering)}>
          <View className="flex flex-row items-center mb-2">
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
            <View className="flex flex-row mb-4">
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
              <View className="p-2 bg-base-700 rounded-lg mb-4">
                <Typography weight="bold" className="text-base-300 text-center">
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
                onPress={() => append({ reps: "", weight: "" })}
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
