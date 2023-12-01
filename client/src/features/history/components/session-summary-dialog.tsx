import { FC } from "react";
import { View } from "react-native";
import clsx from "clsx";
import { format, formatDuration, intervalToDuration } from "date-fns";
import { ScrollView } from "react-native-gesture-handler";

import { DialogProps } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import { Spinner, Typography } from "@features/ui/components";

export const SessionSummaryDialog: FC<
  DialogProps<{
    sessionId: number;
  }>
> = ({ sessionId }) => {
  const { data: session, isLoading } = trpc.training.findSessionLog.useQuery({
    id: sessionId,
  });

  if (!session || isLoading) {
    return <Spinner />;
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} indicatorStyle="white">
      <Typography className="text-xl">{session.name}</Typography>
      <View className="mb-8 flex flex-row justify-between">
        <Typography className="text-base-200">
          {format(new Date(session.startedAt), "dd.MM.yyyy")}
        </Typography>
        <Typography className="text-base-200">
          {formatDuration(
            intervalToDuration({
              start: new Date(session.startedAt),
              end: new Date(session.endedAt),
            }),
            { format: ["minutes"], zero: true }
          )}
        </Typography>
      </View>
      {session.exercises.map((sessionExercise, index) => (
        <View
          key={sessionExercise.id}
          className={clsx(index < session.exercises.length - 1 && "mb-8")}
        >
          <Typography className="mb-2 text-base" weight="bold">
            {sessionExercise.exercise.name}
          </Typography>
          {sessionExercise.sets.map((set, setIndex) => (
            <View
              key={set.id}
              className={clsx(
                "flex flex-row",
                setIndex < sessionExercise.sets.length - 1 && "mb-2"
              )}
            >
              <Typography className="min-w-[25px] text-base-300">
                {setIndex + 1}
              </Typography>
              <Typography className="ml-6 text-base-100">
                {set.reps} x {set.weight} kg
              </Typography>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};
