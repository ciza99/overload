import { useEffect, useMemo, useRef, useState } from "react";
import {
  BottomSheetModal,
  BottomSheetModalType,
  Button,
  Icon,
  Spinner,
  toast,
  Typography,
} from "@components/common";
import { NavigationParamMap } from "@pages";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { AddExerciseBottomSheetContent } from "./add-exercise-bottom-sheet";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  ExerciseFormType,
  ExerciseType,
  SessionFormType,
  SessionType,
  SetFormType,
} from "./types";
import { useIdToExercise } from "./hooks/useExercises";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { Layout } from "react-native-reanimated";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { trpc } from "@utils/trpc";
import { localeInfo } from "@constants/locale";
import { Exercise } from "./exercise";
import {
  arrayMove,
  DndContext,
  restrictToYAxis,
  SortableContext,
} from "@components/common/dnd";
import { BottomSheetActions } from "@components/bottom-sheet-actions";
import { colors } from "@constants/theme";
import { ScrollContainer } from "@components/common/dnd/scroll-container";

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
    []
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
      console.log("success");
      utils.training.getTemplates.invalidate();
      navigation.goBack();
    },
    onError: () => {
      console.log("failed");
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
        <ScrollContainer>
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
                  key={exerciseIndex}
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
                beforeIcon={<Icon name="checkmark-outline" />}
                onPress={() => setReordering(false)}
              >
                Done
              </Button>
            )}

            {!reordering && (
              <Button
                variant="outlined"
                beforeIcon={<Icon name="add-outline" />}
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
