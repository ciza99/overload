import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import {
  format,
  formatDuration,
  intervalToDuration,
  startOfMonth,
} from "date-fns";

import { trpc } from "@features/api/trpc";
import { Icon, Paper, Typography } from "@features/ui/components";

import { SessionLog } from "../types";

export const HistoryScreen = () => {
  const { data: sessions } = trpc.training.listSessionLogs.useQuery();

  const groupedByDate = useMemo(() => {
    return (
      sessions?.reduce<Record<string, SessionLog[]>>((acc, session) => {
        const month = startOfMonth(new Date(session.startedAt));
        const date = format(month, "MMMM yyyy");
        return {
          ...acc,
          [date]: [...(acc[date] ?? []), session],
        };
      }, {}) ?? {}
    );
  }, [sessions]);

  if (!sessions) return null;

  return (
    <ScrollView className="px-4 py-6">
      <Typography className="mb-6 text-2xl" weight="bold">
        Latest sessions
      </Typography>
      {Object.entries(groupedByDate).map(([date, sessions]) => (
        <View className="mb-6" key={date}>
          <Typography className="mb-4 capitalize text-primary" weight="bold">
            {date}
          </Typography>
          {sessions.map((session) => (
            <Paper key={session.id} className="mb-4 p-4">
              <View className="flex flex-row justify-between">
                <Typography weight="bold">{session.name}</Typography>
                <Typography>
                  {format(new Date(session.startedAt), "dd.mm.yyyy")}
                </Typography>
              </View>
              <View className="flex flex-row justify-between">
                <View className="flex flex-row items-center gap-2">
                  <Typography>{session.exercises.length} exercises</Typography>
                  <Typography>
                    <Icon name="ellipse" size={4} />
                  </Typography>
                  <Typography>
                    {formatDuration(
                      intervalToDuration({
                        start: new Date(session.startedAt),
                        end: new Date(session.endedAt),
                      }),
                      { format: ["minutes"], zero: true }
                    )}
                  </Typography>
                </View>
              </View>
            </Paper>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};
