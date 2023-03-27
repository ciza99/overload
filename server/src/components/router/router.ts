import { UserRouter } from "components/user/user-router";
import { SessionRouter } from "components/session/session-router";

import { t } from "utils/trpc";
import { TrainingRouter } from "components/training/training-router";

type RouterFactoryProps = {
  userRouter: UserRouter;
  sessionRouter: SessionRouter;
  trainingRouter: TrainingRouter;
};

export const routerFactory = ({
  userRouter,
  sessionRouter,
  trainingRouter,
}: RouterFactoryProps) =>
  t.router({
    users: userRouter,
    sessions: sessionRouter,
    training: trainingRouter,
  });

export type TRPCRouter = ReturnType<typeof routerFactory>;
