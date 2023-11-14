import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import Animated, { Layout } from "react-native-reanimated";

import { NavigationParamMap } from "@features/core/components/router";
import { localeInfo } from "@features/core/constants/locale";
import { trpc } from "@features/api/trpc";
import {
  BottomSheetModal,
  BottomSheetModalType,
  Button,
  Icon,
  Spinner,
  toast,
  Typography,
} from "@features/ui/components";
import { BottomSheetActions } from "@features/ui/components/bottom-sheet-actions";
import {
  arrayMove,
  DndContext,
  restrictToYAxis,
  SortableContext,
} from "@features/ui/components/dnd";
import { ScrollContainer } from "@features/ui/components/dnd/scroll-container";
import { colors } from "@features/ui/theme";

import { AddExerciseBottomSheetContent } from "../components/add-exercise-bottom-sheet";
import { Exercise } from "../components/exercise";
import { useIdToExercise } from "../hooks/useExercises";
import {
  ExerciseFormType,
  ExerciseType,
  SessionFormType,
  SessionType,
  SetFormType,
} from "../types/training";

type Props = NativeStackScreenProps<NavigationParamMap, "session">;

const numberStringToNumber = (value: string) => {
  if (value === "") return null;
  return Number(value.replace(",", "."));
};

const transformSessionFormForUpload = (form: SessionFormType) => {
  return {
    ...form,
    exercises: form.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map<{ reps: number | null; weight: number | null }>(
        ({ reps, weight }) => ({
          reps: numberStringToNumber(reps),
          weight: numberStringToNumber(weight),
        })
      ),
    })),
  };
};

const numberToFormInput = (value: number | undefined | null) => {
  if (value === undefined || value === null) return "";
  return value.toLocaleString(localeInfo.languageTag);
};

const useFormDefaultValues = ({
  session,
  exercises,
}: {
  session: SessionType;
  exercises: ExerciseType[];
}): SessionFormType => {
  const idToExercise = useIdToExercise(exercises);

  const sessionExercises = useMemo(
    () =>
      session.exercises.reduce<ExerciseFormType[]>((acc, exercise) => {
        const sets = exercise.sets.map<SetFormType>(({ reps, weight }) => ({
          reps: numberToFormInput(reps),
          weight: numberToFormInput(weight),
        }));

        const newExercise: ExerciseFormType = {
          exerciseId: exercise.exerciseId,
          sets,
          name: idToExercise[exercise.exerciseId]?.name,
        };

        return [...acc, newExercise];
      }, []),
    [idToExercise, session.exercises]
  );

  return { exercises: sessionExercises, id: session.id, name: session.name };
};

export const Session = () => {
  const { data: exercises } = trpc.training.getExercises.useQuery();

  if (!exercises) return <Spinner />;

  return <SessionForm exercises={exercises} />;
};

const SessionForm = ({ exercises }: { exercises: ExerciseType[] }) => {
  const {
    params: { session },
  } = useRoute<Props["route"]>();
  const defaultValues = useFormDefaultValues({ session, exercises });
  const methods = useForm({ defaultValues });

  return (
    <FormProvider {...methods}>
      <Exercises />
    </FormProvider>
  );
};

type ExercisesScreenProps = NativeStackNavigationProp<
  NavigationParamMap,
  "session"
>;

const Exercises = () => {
  const [reordering, setReordering] = useState(false);
  const { watch, control, handleSubmit } = useFormContext<SessionFormType>();
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "exercises",
  });
  const name = watch("name");
  const navigation = useNavigation<ExercisesScreenProps>();
  const utils = trpc.useContext();
  const { mutate: updateSession } = trpc.training.updateSession.useMutation({
    onSuccess: () => {
      utils.training.getTemplates.invalidate();
      navigation.goBack();
    },
    onError: () => {
      toast.show({ type: "error", text1: "Session could not be saved" });
    },
  });
  const addExerciseBottomSheet = useRef<BottomSheetModalType>(null);
  const exerciseActionsBottomSheet = useRef<BottomSheetModalType>(null);

  const sortableItems = useMemo(() => {
    return fields.map(({ id }) => id);
  }, [fields]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Typography
          weight="light"
          className="text-base text-primary"
          onPress={handleSubmit((sessionForm) =>
            updateSession(transformSessionFormForUpload(sessionForm))
          )}
        >
          Save
        </Typography>
      ),
    });
  }, [navigation, handleSubmit, updateSession]);

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
        <ScrollContainer className="p-4">
          <Typography weight="bold" className="text-xl mb-4">
            {name}
          </Typography>
          {!fields.length && (
            <View className="p-2 bg-base-700 rounded-lg mb-4">
              <Typography
                weight="bold"
                className="text-base-300 text-center text-lg"
              >
                No exercises
              </Typography>
            </View>
          )}
          <SortableContext items={sortableItems}>
            <ScrollContainer>
              {fields.map((sessionExercise, exerciseIndex) => (
                <Exercise
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
          <Animated.View layout={Layout}>
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
              <Button
                variant="outlined"
                beforeIcon={<Icon color="white" name="add-outline" />}
                onPress={() => addExerciseBottomSheet.current?.present()}
              >
                Add exercise
              </Button>
            )}
          </Animated.View>
          <View className="h-12" />
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
              sets: [{ reps: "", weight: "" }],
            });
            addExerciseBottomSheet.current?.close();
          }}
        />
      </BottomSheetModal>
    </>
  );
};
