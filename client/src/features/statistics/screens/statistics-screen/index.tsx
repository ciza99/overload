import { useState } from "react";
import { Dimensions, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
} from "date-fns";
import { LineChart } from "react-native-chart-kit";

import { trpc } from "@features/api/trpc";
import { Typography } from "@features/ui/components";
import { colors } from "@features/ui/theme";

export const StatisticsScreen = () => {
  const [startDate, setStartDate] = useState(() => startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(() => endOfMonth(new Date()));
  const { data: exercises } = trpc.training.getExercises.useQuery();
  const [selectedExerciseId, setSelectedExerciseId] = useState<
    number | undefined
  >(exercises?.[0].id);

  const selectedExercise = exercises?.find(
    (exercise) => exercise.id === selectedExerciseId
  );

  const { data: statistics, refetch } =
    trpc.statistics.getExerciseStatistics.useQuery({
      exerciseId: selectedExerciseId,
      type: "1RM",
    });

  useFocusEffect(() => void refetch(undefined));

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const labels = days.map((day) => format(day, "dd.MM"));
  const data = days.reduce<{ acc: number[]; max: number }>(
    ({ acc, max }, day) => {
      const dayStatistics = statistics?.find((statistic) =>
        isSameDay(new Date(statistic.performedAt), day)
      );
      return {
        acc: [...acc, dayStatistics?.weight ?? max],
        max: Math.max(max, dayStatistics?.weight ?? 0),
      };
    },
    { acc: [], max: 0 }
  ).acc;

  const hidePointsAtIndex = days.reduce<number[]>((acc, day, index) => {
    if (
      statistics?.find((statistic) =>
        isSameDay(new Date(statistic.performedAt), day)
      )
    )
      return acc;
    return [...acc, index];
  }, []);

  console.log(hidePointsAtIndex);

  console.log({ data, labels });

  return (
    <View className="p-4 pt-8">
      <Typography className="mb-4 text-base" weight="semibold">
        Exercise stats
      </Typography>

      <LineChart
        bezier
        width={Dimensions.get("window").width - 32}
        height={220}
        data={{
          labels,
          datasets: [
            {
              data,
            },
          ],
        }}
        formatYLabel={(value) => `${parseFloat(value).toFixed(1)} kg`}
        hidePointsAtIndex={hidePointsAtIndex}
        fromZero
        chartConfig={{
          color: (opacity = 1) => `rgba(66, 154, 149, ${opacity})`,
          backgroundColor: colors.base[700],
          backgroundGradientFrom: colors.base[700],
          backgroundGradientTo: colors.base[700],
          style: {
            borderRadius: 16,
          },
        }}
      />
    </View>
  );
};
