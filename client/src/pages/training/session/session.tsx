import { useEffect, useMemo, useRef } from "react";
import {
  BottomSheetModal,
  BottomSheetModalType,
  Button,
  Icon,
  TextField,
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
import { SessionType } from "./types";
import { useExercises } from "./hooks/useExercises";
import {
  ScrollView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { BottomSheetActions } from "@components/bottom-sheet-actions";
import { colors } from "@constants/theme";
import Animated, {
  FadeIn,
  FadeOut,
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
import { useIsFirstRender } from "@hooks/use-is-first-render";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { trpc } from "@utils/trpc";
import { localeInfo } from "@constants/locale";

type Props = NativeStackScreenProps<NavigationParamMap, "session">;
type SetFormType = {
  reps: string;
  weight: string;
};
type ExerciseFormType = {
  exerciseId: number;
  name: string;
  sets: SetFormType[];
};
type SessionFormType = {
  id: number;
  exercises: ExerciseFormType[];
  name: string;
};

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

const useFormDefaultValues = (session: SessionType): SessionFormType => {
  console.log({ session });
  const idToExercise = useExercises();
  const exercises = useMemo(
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

  return { exercises, id: session.id, name: session.name };
};

export const Session = () => {
  const {
    params: { session },
  } = useRoute<Props["route"]>();
  const defaultValues = useFormDefaultValues(session);
  const methods = useForm({ defaultValues });
  console.log(JSON.stringify(methods.getValues(), null, 2));
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

type ExercisesScreenProps = NativeStackNavigationProp<
  NavigationParamMap,
  "session"
>;

const Exercises = () => {
  const { control, handleSubmit } = useFormContext<SessionFormType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });
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
  const bottomSheet = useRef<BottomSheetModalType>(null);

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
      {fields.map((sessionExercise, exerciseIndex) => (
        <Exercise
          key={sessionExercise.id}
          exercise={sessionExercise}
          exerciseIndex={exerciseIndex}
          removeSelf={() => remove(exerciseIndex)}
        />
      ))}
      <Animated.View layout={Layout}>
        <Button
          variant="outlined"
          beforeIcon={<Icon name="add-outline" />}
          onPress={() => bottomSheet.current?.present()}
        >
          Add exercise
        </Button>
      </Animated.View>

      <BottomSheetModal ref={bottomSheet} snapPoints={["75%", "100%"]}>
        <AddExerciseBottomSheetContent
          onAdd={(exercise) => {
            append({
              exerciseId: exercise.id,
              name: exercise.name,
              sets: [{ reps: "", weight: "" }],
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
  exerciseIndex,
  removeSelf,
}: {
  exercise: ExerciseFormType;
  exerciseIndex: number;
  removeSelf: () => void;
}) => {
  const { control, getValues, setValue } = useFormContext<SessionFormType>();
  const bottomSheet = useRef<BottomSheetModalType>(null);
  const { fields, append, remove } = useFieldArray({
    control,
    name: `exercises.${exerciseIndex}.sets`,
  });

  return (
    <Animated.View
      className="mb-4"
      entering={FadeIn}
      exiting={FadeOut}
      layout={Layout}
    >
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
          beforeIcon={<Icon name="add-outline" />}
          className="bg-base-600"
          onPress={() => append({ reps: "", weight: "" })}
        >
          Add set
        </Button>
      </Animated.View>
    </Animated.View>
  );
};

const swipeThreshold = 100;
const Set = ({
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

  console.log({ set });

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
            className="absolute bg-danger -top-1 -bottom-1 -left-full -right-full"
          />
          <Animated.View
            className=" flex flex-row items-center justify-stretch"
            style={rowStyle}
          >
            <View className="flex-[1] rounded-xl">
              <View className="bg-base-600 rounded-xl">
                <Typography className="py-2 text-center">{setIndex}</Typography>
              </View>
            </View>
            <View className="flex-[3] rounded-xl">
              <View className="rounded-xl">
                <Typography className="py-2 text-center">no data</Typography>
              </View>
            </View>
            <View className="flex-[3] rounded-xl">
              <TextField
                control={control}
                name={`exercises.${exerciseIndex}.sets.${setIndex}.weight`}
                maxLength={6}
                className="ml-3"
                keyboardType="numeric"
              />
            </View>
            <View className="flex-[3] rounded-xl">
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
