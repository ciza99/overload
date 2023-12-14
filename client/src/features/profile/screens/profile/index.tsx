import { useMemo } from "react";
import { View } from "react-native";
import { startOfDay } from "date-fns";
import differenceInDays from "date-fns/esm/fp/differenceInDays";

import { useStore } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import {
  Button,
  Icon,
  Paper,
  TextButton,
  Typography,
} from "@features/ui/components";
import { ScrollSelectDialog } from "@features/profile/components/scroll-select-dialog";
import { getSessionForDate } from "@features/profile/lib/routine";
import { useSession } from "@features/training/hooks/useSession";
import { SessionType } from "@features/training/types/training";

import { Calendar } from "./parts/calendar";

export const Profile = () => {
  const user = useStore((store) => store.auth.user);
  const { startSession } = useSession();
  const open = useStore((store) => store.dialog.open);
  const utils = trpc.useUtils();

  const { data: routine, isLoading: isRoutineLoading } =
    trpc.routine.getRoutine.useQuery();

  const { data: exercises, isLoading: isExercisesLoading } =
    trpc.training.getExercises.useQuery();

  const { mutate: upsertRoutine } = trpc.routine.selectRoutine.useMutation({
    onSuccess: () => {
      utils.routine.getRoutine.invalidate();
    },
  });

  const sessionToday = useMemo(
    () => getSessionForDate(new Date(), routine),
    [routine]
  );

  return (
    <>
      <View className="p-4">
        <Paper className="flex flex-row items-center p-4">
          <Paper elevation={2} className="mr-4 h-16 w-16" />
          <View className="flex flex-col items-start">
            <Typography>{user?.username}</Typography>
            <TextButton>Edit profile</TextButton>
          </View>
        </Paper>
        <Paper className="mt-4">
          <View className="flex flex-row justify-between p-4">
            <Typography>Today:</Typography>
            <Typography className="text-base-300">
              {sessionToday?.isRest ? "Rest day" : sessionToday?.name ?? "-"}
            </Typography>
          </View>
        </Paper>
        <View className="mt-4 flex flex-row">
          <Button
            className="flex-1"
            onPress={() => {
              if (!exercises || !sessionToday) return;
              startSession(sessionToday, exercises);
            }}
            beforeIcon={<Icon name="caret-forward" />}
            disabled={!routine || sessionToday?.isRest}
            loading={isRoutineLoading || isExercisesLoading}
          >
            Start training
          </Button>
          <Button
            variant="outlined"
            className="ml-4 flex-1"
            disabled={!routine}
            beforeIcon={<Icon name="repeat" />}
            onPress={() =>
              open<ScrollSelectDialog<SessionType>>({
                Component: ScrollSelectDialog,
                title: "Change session",
                props: {
                  items: routine?.template.sessions ?? [],
                  extractId: (item) => item.id,
                  extractLabel: (item) => item.name,
                  defaultOffset: routine?.template.sessions.findIndex(
                    (s) => s.id === sessionToday?.id
                  ),
                  onDone: (session) => {
                    const newIndex = routine?.template.sessions.findIndex(
                      (s) => s.id === session.id
                    );
                    if (!routine || newIndex === undefined) {
                      return;
                    }
                    const routineDayOffset = differenceInDays(
                      new Date(),
                      startOfDay(new Date(routine.startedAt))
                    );

                    upsertRoutine({
                      shift: routineDayOffset + newIndex,
                      templateId: routine.template.id,
                    });
                  },
                },
              })
            }
          >
            Change session
          </Button>
        </View>
        <View className="pt-4" />
        <Calendar />
      </View>
    </>
  );
};
