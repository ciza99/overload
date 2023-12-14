import { UserRouter } from "features/user/user-router";
import { SessionRouter } from "features/session/session-router";

import { t } from "features/api/trpc";
import { TrainingRouter } from "features/training/training-router";
import { RoutineRouter } from "features/routine/routine-router";
import { StatisticsRouter } from "features/statistics/statistics-router";

type RouterFactoryProps = {
  userRouter: UserRouter;
  sessionRouter: SessionRouter;
  trainingRouter: TrainingRouter;
  routineRouter: RoutineRouter;
  statisticsRouter: StatisticsRouter;
};

export const routerFactory = ({
  userRouter,
  sessionRouter,
  trainingRouter,
  routineRouter,
  statisticsRouter,
}: RouterFactoryProps) =>
  t.router({
    users: userRouter,
    sessions: sessionRouter,
    training: trainingRouter,
    routine: routineRouter,
    statistics: statisticsRouter,
  });

export type TRPCRouter = ReturnType<typeof routerFactory>;
