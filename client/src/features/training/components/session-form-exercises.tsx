import { FC, ReactNode, useMemo, useRef, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useFieldArray, useFormContext } from "react-hook-form";
import Animated, { Layout } from "react-native-reanimated";

import {
  BottomSheetModal,
  BottomSheetModalType,
  Button,
  Icon,
  Typography,
} from "@features/ui/components";
import { BottomSheetActions } from "@features/ui/components/bottom-sheet-actions";
import {
  arrayMove,
  DndContext,
  restrictToYAxis,
  ScrollContainer,
  SortableContext,
} from "@features/ui/components/dnd";
import { colors } from "@features/ui/theme";

import { SessionFormType } from "../types/training";
import { AddExerciseBottomSheetContent } from "./add-exercise-bottom-sheet";
import { Exercise } from "./exercise";

export const SessionFormExercises: FC<{
  className?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  actions?: ReactNode;
  disableSetCompletion?: boolean;
}> = ({ className, actions, contentContainerStyle, disableSetCompletion }) => {
  const [reordering, setReordering] = useState(false);
  const { watch, control } = useFormContext<SessionFormType>();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "exercises",
  });
  const name = watch("name");
  const addExerciseBottomSheet = useRef<BottomSheetModalType>(null);
  const exerciseActionsBottomSheet = useRef<BottomSheetModalType>(null);

  const sortableItems = useMemo(() => {
    return fields.map(({ id }) => id);
  }, [fields]);

  return (
    <>
      <DndContext
        modifiers={[restrictToYAxis]}
        onDragEnd={({ active, over }) => {
          if (!over) return;

          const activeIndex = fields.findIndex(({ id }) => id == active.id);
          const overIndex = fields.findIndex(({ id }) => id == over.id);

          if (activeIndex === -1 || overIndex === -1) return;
          replace(arrayMove(fields, activeIndex, overIndex));
        }}
      >
        <ScrollContainer
          className={className}
          contentContainerStyle={contentContainerStyle}
        >
          <View className={"px-4"}>
            <Typography weight="bold" className="mb-4 text-xl">
              {name}
            </Typography>
            {!fields.length && (
              <View className="mb-4 rounded-lg bg-base-700 p-2">
                <Typography
                  weight="bold"
                  className="text-center text-lg text-base-300"
                >
                  No exercises
                </Typography>
              </View>
            )}
          </View>
          <SortableContext items={sortableItems}>
            <ScrollContainer>
              {fields.map((sessionExercise, exerciseIndex) => (
                <Exercise
                  disableSetCompletion={disableSetCompletion}
                  id={sessionExercise.id}
                  key={sessionExercise.id}
                  exercise={sessionExercise}
                  exerciseIndex={exerciseIndex}
                  removeSelf={() => remove(exerciseIndex)}
                  exerciseActionsBottomSheet={exerciseActionsBottomSheet}
                  reordering={reordering}
                />
              ))}
            </ScrollContainer>
          </SortableContext>
          <Animated.View layout={Layout} className="px-4">
            {reordering && (
              <Button
                variant="primary"
                beforeIcon={<Icon color="white" name="checkmark-outline" />}
                onPress={() => setReordering(false)}
              >
                Done
              </Button>
            )}

            {!reordering && (
              <>
                <Button
                  variant="outlined"
                  beforeIcon={<Icon color="white" name="add-outline" />}
                  onPress={() => addExerciseBottomSheet.current?.present()}
                >
                  Add exercise
                </Button>
                {actions}
              </>
            )}
          </Animated.View>
        </ScrollContainer>
      </DndContext>

      <BottomSheetModal
        snapPoints={["75%", "100%"]}
        ref={exerciseActionsBottomSheet}
      >
        {({ data: exerciseIndex }: { data: number }) => (
          <BottomSheetActions
            actions={[
              {
                label: "Delete",
                icon: <Icon color={colors.danger} name="trash-outline" />,
                onPress: () => {
                  remove(exerciseIndex);
                  exerciseActionsBottomSheet.current?.close();
                },
              },
              {
                label: "Reorder exercises",
                icon: (
                  <Icon color={colors.primary} name="swap-vertical-outline" />
                ),
                onPress: () => {
                  setReordering(true);
                  exerciseActionsBottomSheet.current?.close();
                },
              },
            ]}
          />
        )}
      </BottomSheetModal>

      <BottomSheetModal
        ref={addExerciseBottomSheet}
        snapPoints={["75%", "100%"]}
      >
        <AddExerciseBottomSheetContent
          onAdd={(exercise) => {
            append({
              exerciseId: exercise.id,
              name: exercise.name,
              sets: [{ reps: "", weight: "", completed: false }],
            });
            addExerciseBottomSheet.current?.close();
          }}
        />
      </BottomSheetModal>
    </>
  );
};
