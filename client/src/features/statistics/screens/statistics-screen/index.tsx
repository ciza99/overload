import React, { useRef, useState } from "react";
import { Dimensions, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import {
  BottomSheetModal,
  BottomSheetModalType,
  Button,
  Icon,
  Typography,
} from "@features/ui/components";
import { SelectItem, SelectRoot } from "@features/ui/components/select";
import { colors } from "@features/ui/theme";
import { AddExerciseBottomSheetContent } from "@features/training/components/add-exercise-bottom-sheet";

type ExerciseStatisticsType = "1RM" | "Volume";

const typeOptions: ExerciseStatisticsType[] = ["1RM", "Volume"];

export const StatisticsScreen = () => {
  const [startDate, setStartDate] = useState(() => startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(() => new Date());
  const [type, setType] = useState<ExerciseStatisticsType>("1RM");
  const { data: exercises } = trpc.training.getExercises.useQuery();
  const [selectedExerciseId, setSelectedExerciseId] = useState<
    number | undefined
  >(exercises?.[0].id);

  const ref = useRef<BottomSheetModalType>(null);

  const selectedExercise = exercises?.find(
    (exercise) => exercise.id === selectedExerciseId
  );

  console.log({ type });

  const { data: statistics, refetch } =
    trpc.statistics.getExerciseStatistics.useQuery({
      exerciseId: selectedExerciseId,
      type,
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

  console.log({ statistics, labels });

  return (
    <>
      <View className="p-4 pt-8">
        <View className="mb-8 flex flex-row items-center">
          <View className="mr-8 flex flex-row items-center justify-end">
            <Typography weight="semibold" className="text-base">
              start:
            </Typography>
            <DateTimePicker
              value={startDate}
              maximumDate={endDate}
              onChange={(_, date) => date && setStartDate(date)}
              textColor="white"
              accentColor={colors.primary}
              themeVariant="dark"
            />
          </View>
          <View className="flex flex-row items-center justify-end">
            <Typography weight="semibold" className="text-base">
              end:
            </Typography>
            <DateTimePicker
              value={endDate}
              maximumDate={new Date()}
              minimumDate={startDate}
              onChange={(_, date) => date && setEndDate(date)}
              textColor="white"
              accentColor={colors.primary}
              themeVariant="dark"
            />
          </View>
        </View>

        <Typography className="mb-4 text-base" weight="semibold">
          Exercise stats
        </Typography>

        <View className="mb-4 flex flex-row items-center">
          <SelectRoot
            value={selectedExerciseId?.toString() ?? ""}
            onChange={(value) =>
              setSelectedExerciseId(parseInt(value as string))
            }
            renderValue={() => (
              <Typography>{selectedExercise?.name}</Typography>
            )}
            className="mr-1 flex-1"
          >
            {exercises?.map((exercise) => (
              <SelectItem key={exercise.id} value={exercise.id.toString()}>
                <View className="mb-4 flex flex-row justify-between">
                  <Typography className="text-base" weight="bold">
                    {exercise.name}
                  </Typography>
                  <Icon
                    color={colors.primary}
                    className="flex-1"
                    name="chevron-forward-outline"
                  />
                </View>
              </SelectItem>
            ))}
          </SelectRoot>
          <SelectRoot
            className="ml-1 flex-1"
            value={type}
            onChange={(type) => setType(type as ExerciseStatisticsType)}
          >
            {typeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                <View className="mb-4 flex flex-row justify-between">
                  <Typography className="flex-1">{type}</Typography>
                  <Icon
                    color={colors.primary}
                    className="flex-1"
                    name="chevron-forward-outline"
                  />
                </View>
              </SelectItem>
            ))}
          </SelectRoot>
        </View>

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
          horizontalLabelRotation={-45}
          formatYLabel={(value) => `${parseFloat(value).toFixed(1)} kg`}
          hidePointsAtIndex={hidePointsAtIndex}
          fromZero
          getDotColor={() => "white"}
          withVerticalLines={false}
          style={{
            borderRadius: 16,
          }}
          chartConfig={{
            color: (opacity = 1) => `rgba(66, 154, 149, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            backgroundColor: colors.base[700],
            backgroundGradientFrom: colors.base[700],
            backgroundGradientTo: colors.base[700],
            decimalPlaces: 1,
            propsForBackgroundLines: {
              strokeDasharray: "0",
              strokeWidth: 0.25,
              stroke: `rgba(255, 255, 255, 0.25)`,
            },
          }}
        />
      </View>
    </>
  );
};
