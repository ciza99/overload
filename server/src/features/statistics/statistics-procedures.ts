import { authProcedure } from "features/api/procedures";
import { exerciseStatisticsInputSchema } from "./statistics-schema";
import { StatisticsService } from "./statistics-service";

export type StatisticsProcedures = ReturnType<
  typeof statisticsProceduresFactory
>;

export const statisticsProceduresFactory = ({
  statisticsService,
}: {
  statisticsService: StatisticsService;
}) => ({
  getExerciseStatistics: authProcedure
    .input(exerciseStatisticsInputSchema)
    .query(async ({ input, ctx }) => {
      return await statisticsService.getExerciseStatistics(input, ctx.user);
    }),
});
