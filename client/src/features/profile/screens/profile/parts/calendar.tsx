import { FC } from "react";
import { View } from "react-native";
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";

import { trpc } from "@features/api/trpc";
import { Icon, Spinner, Typography } from "@features/ui/components";

import { CalendarItem } from "./calendar-item";

export const Calendar: FC = () => {
  const { data: routine } = trpc.routine.getRoutine.useQuery();
  const { data: sessionLogs } = trpc.training.listSessionLogs.useQuery({
    lte: endOfMonth(new Date()),
    gte: startOfMonth(new Date()),
  });

  console.log({ routine, sessionLogs });
  if (routine === undefined || !sessionLogs) return <Spinner />;

  const days = eachDayOfInterval({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  return (
    <View>
      <View className="flex flex-row justify-between">
        <Icon color="white" name="chevron-back" />
        <Typography weight="bold" className="text-xl">
          {format(new Date(), "MMMM yyyy")}
        </Typography>
        <Icon color="white" name="chevron-forward" />
      </View>
      <View className="mt-4 flex flex-row flex-wrap items-center justify-center">
        {days.map((date) => (
          <CalendarItem
            key={date.getTime()}
            sessionLogs={sessionLogs}
            routine={routine}
            date={date}
          />
        ))}
      </View>
    </View>
  );
};
