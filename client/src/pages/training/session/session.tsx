import { useMemo, useRef } from "react";
import {
  BottomSheetModal,
  BottomSheetModalType,
  Button,
  Icon,
  Typography,
} from "@components/common";
import { NavigationParamMap } from "@pages";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScrollView, View } from "react-native";
import { AddExerciseBottomSheetContent } from "./add-exercise-bottom-sheet";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { SessionType } from "./types";
import { useExercises } from "./hooks/useExercises";
import { Gesture } from "react-native-gesture-handler";
import { BottomSheetActions } from "@components/bottom-sheet-actions";
import { colors } from "@constants/theme";

type Props = NativeStackScreenProps<NavigationParamMap, "session">;
type SetFormType = {
  reps?: number;
  weight?: number;
};
type ExerciseFormType = {
  exerciseId: number;
  name: string;
  sets: SetFormType[];
};
type SessionFormType = { exercises: ExerciseFormType[]; name: string };

const useFormDefaultValues = (session: SessionType): SessionFormType => {
  const idToExercise = useExercises();
  const exercises = useMemo(
    () =>
      session.exercises.reduce<ExerciseFormType[]>((acc, exercise) => {
        const sets = exercise.sets.map<SetFormType>(({ reps, weight }) => ({
          reps: reps ?? undefined,
          weight: weight ?? undefined,
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

  return { exercises, name: session.name };
};

export const Session = () => {
  const {
    params: { session },
  } = useRoute<Props["route"]>();
  const defaultValues = useFormDefaultValues(session);
  const methods = useForm({ defaultValues });
  const name = methods.watch("name");

  return (
    <FormProvider {...methods}>
      <ScrollView className="p-4">
        <Typography weight="bold" className="text-xl mb-4">
          {name}
        </Typography>
        <Exercises />
        <View className="h-12" />
      </ScrollView>
    </FormProvider>
  );
};

const Exercises = () => {
  const { control, watch, setValue, getValues } =
    useFormContext<SessionFormType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });
  const bottomSheet = useRef<BottomSheetModalType>(null);

  return (
    <>
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
      {fields.map((sessionExercise, index) => (
        <Exercise
          key={sessionExercise.id}
          exercise={sessionExercise}
          index={index}
          removeSelf={() => remove(index)}
        />
      ))}
      <Button
        variant="outlined"
        beforeIcon={<Icon name="add-outline" />}
        onPress={() => bottomSheet.current?.present()}
      >
        Add exercise
      </Button>

      <BottomSheetModal ref={bottomSheet} snapPoints={["75%", "100%"]}>
        <AddExerciseBottomSheetContent
          onAdd={(exercise) => {
            append({
              exerciseId: exercise.id,
              name: exercise.name,
              sets: [],
            });
            bottomSheet.current?.close();
          }}
        />
      </BottomSheetModal>
    </>
  );
};

const Exercise = ({
  exercise,
  index,
  removeSelf,
}: {
  exercise: ExerciseFormType;
  index: number;
  removeSelf: () => void;
}) => {
  const { control, getValues, setValue } = useFormContext<SessionFormType>();
  const bottomSheet = useRef<BottomSheetModalType>(null);
  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${index}.sets`,
  });

  return (
    <View className="mb-4">
      <View className="flex flex-row items-center mb-4">
        <View className="mr-2">
          <Icon name="reorder-three-outline" />
        </View>
        <Typography weight="bold" className="mr-auto text-lg">
          {exercise.name}
        </Typography>
        <Icon
          name="ellipsis-horizontal-outline"
          onPress={() => bottomSheet.current?.present()}
        />
        <BottomSheetModal snapPoints={["75%", "100%"]} ref={bottomSheet}>
          <BottomSheetActions
            actions={[
              {
                label: "Edit name",
                icon: <Icon color={colors.primary} name="create-outline" />,
                onPress: () => {
                  // TODO
                },
              },
              {
                label: "Delete",
                icon: <Icon color={colors.danger} name="trash-outline" />,
                onPress: () => {
                  removeSelf();
                  bottomSheet.current?.close();
                },
              },
            ]}
          />
        </BottomSheetModal>
      </View>
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
        <View className="flex-[2]">
          <Typography weight="bold" className="text-center">
            Kg
          </Typography>
        </View>
        <View className="flex-[2]">
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
      {fields.map((set, index) => (
        <Set
          key={set.id}
          set={set}
          index={index}
          removeSelf={() => remove(index)}
        />
      ))}
      <Button
        variant="primary"
        beforeIcon={<Icon name="add-outline" />}
        className="bg-base-600"
        onPress={() => append({})}
      >
        Add set
      </Button>
    </View>
  );
};

const Set = ({
  set,
  index,
  removeSelf,
}: {
  set: SetFormType;
  index: number;
  removeSelf: () => void;
}) => {
  // TODO: remove on swipe left and check on swipe right if in training
  const panGesture = Gesture.Pan()
    .onUpdate(() => {})
    .onEnd(() => {});

  return (
    <View className="flex flex-row items-stretch justify-stretch mb-2">
      <View className="flex-[1] rounded-xl">
        <View className="bg-base-600 rounded-xl">
          <Typography className="py-2 text-center">{index}</Typography>
        </View>
      </View>
      <View className="flex-[3] rounded-xl">
        <View className="rounded-xl">
          <Typography className="py-2 text-center">no data</Typography>
        </View>
      </View>
      <View className="flex-[2] rounded-xl">
        <View className="ml-2 bg-base-600 rounded-xl">
          <Typography className="py-2 ml-3">{set.reps}</Typography>
        </View>
      </View>
      <View className="flex-[2] rounded-xl">
        <View className="ml-2 bg-base-600 rounded-xl">
          <Typography className="py-2 ml-3">{set.weight}</Typography>
        </View>
      </View>
    </View>
  );
};
