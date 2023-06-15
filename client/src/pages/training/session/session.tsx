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
import { trpc } from "@utils/trpc";
import { ScrollView, View } from "react-native";
import {
  ExerciseT,
  SessionProvider,
  SetT,
  useSessionCtx,
} from "./session-context";
import { AddExerciseBottomSheetContent } from "./add-exercise-bottom-sheet";
import { v4 } from "uuid";

type Props = NativeStackScreenProps<NavigationParamMap, "session">;

export const Session = () => {
  const {
    params: { session },
  } = useRoute<Props["route"]>();

  return (
    <SessionProvider session={session}>
      <SessionContent />
    </SessionProvider>
  );
};

const SessionContent = () => {
  const { session, exercises, addExercise } = useSessionCtx();
  const bottomSheet = useRef<BottomSheetModalType>(null);

  return (
    <>
      <ScrollView className="p-4">
        <Typography weight="bold" className="text-xl mb-4">
          {session.name}
        </Typography>

        {!exercises.length && (
          <View className="p-2 bg-base-700 rounded-lg mb-4">
            <Typography
              weight="bold"
              className="text-base-300 text-center text-lg"
            >
              No exercises
            </Typography>
          </View>
        )}
        {exercises.map((sessionExercise) => (
          <Exercise exercise={sessionExercise} />
        ))}
        <Button
          variant="outlined"
          beforeIcon={<Icon name="add-outline" />}
          onPress={() => bottomSheet.current?.present()}
        >
          Add exercise
        </Button>
      </ScrollView>

      <BottomSheetModal ref={bottomSheet} snapPoints={["50%", "100%"]}>
        <AddExerciseBottomSheetContent
          onAdd={(exercise) => {
            console.log({ exercise });
            addExercise({
              id: v4(),
              exerciseId: exercise.id,
              name: exercise.name,
              setIds: [],
            });
            bottomSheet.current?.close();
          }}
        />
      </BottomSheetModal>
    </>
  );
};

const Exercise = ({ exercise }: { exercise: ExerciseT }) => {
  const { sets: allSets } = useSessionCtx();
  const sets = useMemo(() => allSets[exercise.id], [allSets]);

  return (
    <View className="mb-4">
      <View className="flex flex-row items-center mb-4">
        <View className="mr-2">
          <Icon name="reorder-three-outline" />
        </View>
        <Typography weight="bold" className="mr-auto text-lg">
          {exercise.name}
        </Typography>
        <Icon name="ellipsis-horizontal-outline" />
      </View>
      <View className="flex flex-row mb-4">
        <Typography weight="bold" className="grow-[1]">
          Set
        </Typography>
        <Typography weight="bold" className="grow-[3]">
          Previous
        </Typography>
        <Typography weight="bold" className="grow-[2]">
          Kg
        </Typography>
        <Typography weight="bold" className="grow-[2]">
          Reps
        </Typography>
      </View>
      {!sets?.length && (
        <View className="p-2 bg-base-700 rounded-lg mb-4">
          <Typography weight="bold" className="text-base-300 text-center">
            No sets
          </Typography>
        </View>
      )}
      {sets?.map((set) => (
        <Set set={set} />
      ))}
      <Button
        variant="primary"
        beforeIcon={<Icon name="add-outline" />}
        className="bg-base-600"
      >
        Add set
      </Button>
    </View>
  );
};

const Set = ({ set }: { set: SetT }) => {
  return <View>{set.reps ?? 0}</View>;
};
