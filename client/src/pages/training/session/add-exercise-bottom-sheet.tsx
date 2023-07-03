import {
  BottomSheetModalType,
  Divider,
  Icon,
  TextField,
  Typography,
} from "@components/common";
import { colors } from "@constants/theme";
import { BottomSheetScrollView, useBottomSheet } from "@gorhom/bottom-sheet";
import { useDebounce } from "@hooks/use-debounce";
import { trpc } from "@utils/trpc";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, Pressable, View } from "react-native";
import { ExerciseType } from "./types";

export const AddExerciseBottomSheetContent = ({
  onAdd,
}: {
  onAdd: (exercise: ExerciseType) => void;
}) => {
  const { data: exercises } = trpc.training.getExercises.useQuery();
  const { control, watch } = useForm({ defaultValues: { search: "" } });
  const search = useDebounce(watch("search"), 500);
  const { snapToIndex } = useBottomSheet();

  const filteredExercises = useMemo(
    () =>
      exercises?.filter((exercise) =>
        exercise.name.toLowerCase().includes(search.toLowerCase())
      ),
    [exercises, search]
  );

  useEffect(() => {
    const subscription = Keyboard.addListener("keyboardWillShow", () => {
      snapToIndex(1);
    });

    return () => {
      Keyboard.removeSubscription(subscription);
    };
  }, [snapToIndex]);

  return (
    <BottomSheetScrollView>
      <View className="p-4">
        <TextField
          className="mb-4"
          placeholder="search"
          name="search"
          control={control}
          rightContent={<Icon name="search-outline" />}
        />
        {filteredExercises?.map((exercise) => (
          <>
            <Pressable onPress={() => onAdd(exercise)}>
              <View className="flex flex-row items-center">
                <View className="mr-auto">
                  <Typography weight="bold" className="text-lg">
                    {exercise.name}
                  </Typography>
                  <View className="flex flex-row">
                    <Typography className="mr-1">
                      {exercise.bodyParts
                        .map((bodyPart) => bodyPart.id)
                        .join(",")}
                    </Typography>
                  </View>
                </View>
                <Icon color={colors.primary} name="chevron-forward-outline" />
              </View>
            </Pressable>
            <Divider className="my-2" />
          </>
        ))}
      </View>
    </BottomSheetScrollView>
  );
};
