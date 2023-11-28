import { FC, useState } from "react";
import { View } from "react-native";
import {
  addMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { trpc } from "@features/api/trpc";
import { Icon, Spinner, Typography } from "@features/ui/components";

import { CalendarItem } from "./calendar-item";

export const Calendar: FC = () => {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const { data: routine } = trpc.routine.getRoutine.useQuery();
  const { data: sessionLogs } = trpc.training.listSessionLogs.useQuery({
    gte: month,
    lt: endOfMonth(month),
  });

  if (routine === undefined || !sessionLogs) return <Spinner />;

  console.log(month);

  const weeks = eachWeekOfInterval({
    start: startOfWeek(month),
    end: endOfWeek(endOfMonth(month)),
  });

  return (
    <View>
      <View className="mb-4 flex flex-row justify-between">
        <Icon
          color="white"
          name="chevron-back"
          onPress={() => setMonth((prev) => addMonths(prev, -1))}
        />
        <Typography weight="bold" className="text-xl">
          {format(month, "MMMM yyyy")}
        </Typography>
        <Icon
          color="white"
          name="chevron-forward"
          onPress={() => setMonth((prev) => addMonths(prev, 1))}
        />
      </View>
      <View className="flex flex-row items-center justify-between ">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Typography
            key={day}
            weight="semibold"
            className="mx-1 my-2 flex-[1] text-center uppercase"
          >
            {day}
          </Typography>
        ))}
      </View>
      {weeks.map((week) => (
        <View className="flex flex-row" key={week.getTime()}>
          {eachDayOfInterval({
            start: week,
            end: endOfWeek(week),
          }).map((day) => (
            <CalendarItem
              month={month}
              key={day.getTime()}
              routine={routine}
              date={day}
              sessionLogs={sessionLogs}
            />
          ))}
        </View>
      ))}
    </View>
  );
};
