import { FC, useMemo } from "react";
import { View } from "react-native";
import { TabActions, useNavigation } from "@react-navigation/native";
import clsx from "clsx";
import { format, isFuture, isPast, isToday } from "date-fns";

import { trpc } from "@features/api/trpc";
import { TextButton, Typography } from "@features/ui/components";
import { SessionLog } from "@features/history/types";
import { getSessionForDate } from "@features/profile/lib/routine";
import { Routine } from "@features/profile/types/routine";
import { useSession } from "@features/training/hooks/useSession";

export const CalendarPopover: FC<{
  date: Date;
  routine: Routine;
  sessionLogs: SessionLog[];
  close: () => void;
}> = ({ date, routine, sessionLogs, close }) => {
  const { dispatch } = useNavigation();
  const session = useMemo(
    () => getSessionForDate(date, routine),
    [routine, date]
  );
  const { data: exercises } = trpc.training.getExercises.useQuery();

  const { startSession } = useSession();
  const hasLogs = !!sessionLogs.length;

  if (!exercises) return null;

  return (
    <View className="min-w-[150px] rounded-lg bg-base-700 p-4">
      {(isFuture(date) || isToday(date)) && !hasLogs && (
        <>
          <Typography
            weight="bold"
            className={clsx(
              !session?.isRest && "mb-4",
              session?.isRest && "text-base-300"
            )}
          >
            {session?.isRest ? "Rest day" : session?.name ?? "No session"}
          </Typography>
          {session && !session.isRest && (
            <TextButton
              onPress={() => {
                close();
                startSession(session, exercises);
              }}
            >
              Start session
            </TextButton>
          )}
        </>
      )}
      {((!isToday(date) && isPast(date)) || (isToday(date) && hasLogs)) && (
        <>
          {!hasLogs && (
            <Typography className="text-sm text-base-100">
              No session logs
            </Typography>
          )}
          {sessionLogs.slice(0, 3).map(({ name, startedAt, id }) => {
            return (
              <View
                key={id}
                className="mb-2 flex flex-row justify-between gap-x-8"
              >
                <Typography className="text-sm text-base-100">
                  {name}
                </Typography>
                <Typography className="text-sm text-base-100">
                  {format(new Date(startedAt), "HH:mm")}
                </Typography>
              </View>
            );
          })}
          {sessionLogs.length > 3 && (
            <Typography className="mb-2 text-xs text-base-300">
              +{sessionLogs.length - 3} more
            </Typography>
          )}
          {hasLogs && (
            <TextButton
              onPress={() => {
                close();
                dispatch(TabActions.jumpTo("historyRoutes"));
              }}
            >
              View history
            </TextButton>
          )}
        </>
      )}
    </View>
  );
};
