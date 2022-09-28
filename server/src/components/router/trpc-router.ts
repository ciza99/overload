import { UserRouter } from "components/user/user-router";
import { SessionRouter } from "components/session/session-router";

import { t } from "trpc";

type RouterFactoryProps = {
  userRouter: UserRouter;
  sessionRouter: SessionRouter;
};

export const routerFactory = ({
  userRouter,
  sessionRouter,
}: RouterFactoryProps) =>
  t.router({
    users: userRouter,
    sessions: sessionRouter,
  });

export type TRPCRouter = ReturnType<typeof routerFactory>;
