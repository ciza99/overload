import { Fragment, useEffect, useMemo } from "react";
import { Keyboard, Pressable, View } from "react-native";
import { BottomSheetScrollView, useBottomSheet } from "@gorhom/bottom-sheet";
import { useForm } from "react-hook-form";

import { useDebounce } from "@features/core/hooks/use-debounce";
import { trpc } from "@features/api/trpc";
import { Divider, Icon, TextField, Typography } from "@features/ui/components";
import { colors } from "@features/ui/theme";

import { ExerciseType } from "../types/training";

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

    return () => subscription.remove();
  }, [snapToIndex]);

  return (
    <BottomSheetScrollView>
      <View className="p-4">
        <TextField
          className="mb-4"
          placeholder="search"
          name="search"
          control={control}
          rightContent={<Icon color="white" name="search-outline" />}
        />
        {filteredExercises?.map((exercise) => (
          <Fragment key={exercise.id}>
            <Pressable onPress={() => onAdd(exercise)}>
              <View className="flex flex-row items-center">
                <View className="mr-auto">
                  <Typography weight="bold" className="text-lg">
                    {exercise.name}
                  </Typography>
                  <View className="flex flex-row">
                    <Typography className="mr-1">
                      {exercise.bodyParts
                        .map((bodyPart) => bodyPart.bodyPart.name)
                        .join(",")}
                    </Typography>
                  </View>
                </View>
                <Icon color={colors.primary} name="chevron-forward-outline" />
              </View>
            </Pressable>
            <Divider className="my-2" />
          </Fragment>
        ))}
      </View>
    </BottomSheetScrollView>
  );
};
