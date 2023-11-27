import { UserRouter } from "components/user/user-router";
import { SessionRouter } from "components/session/session-router";

import { t } from "utils/trpc";
import { TrainingRouter } from "components/training/training-router";
import { RoutineRouter } from "components/routine/routine-router";

type RouterFactoryProps = {
  userRouter: UserRouter;
  sessionRouter: SessionRouter;
  trainingRouter: TrainingRouter;
  routineRouter: RoutineRouter;
};

export const routerFactory = ({
  userRouter,
  sessionRouter,
  trainingRouter,
  routineRouter,
}: RouterFactoryProps) =>
  t.router({
    users: userRouter,
    sessions: sessionRouter,
    training: trainingRouter,
    routine: routineRouter,
  });

export type TRPCRouter = ReturnType<typeof routerFactory>;
