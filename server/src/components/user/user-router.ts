import { t } from "utils/trpc";

import { UserProducers } from "./user-procedures";

export type UserRouter = ReturnType<typeof userRouterFactory>;

export const userRouterFactory = ({
  userProducers,
}: {
  userProducers: UserProducers;
}) => t.router(userProducers);
