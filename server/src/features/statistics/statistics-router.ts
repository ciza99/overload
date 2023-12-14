import { t } from "features/api/trpc";
import { StatisticsProcedures } from "./statistics-procedures";

export type StatisticsRouter = ReturnType<typeof statisticsRouterFactory>;

export const statisticsRouterFactory = ({
  statisticsProcedures,
}: {
  statisticsProcedures: StatisticsProcedures;
}) => t.router(statisticsProcedures);
