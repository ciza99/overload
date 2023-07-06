import { BottomSheetActions } from "@components/bottom-sheet-actions";
import {
  BottomSheetModal,
  BottomSheetModalType,
  Button,
  Icon,
  Typography,
} from "@components/common";
import { colors } from "@constants/theme";
import { useRef } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { ExerciseFormType, SessionFormType } from "./types";
import { Set } from "./set";

export const Exercise = ({
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
