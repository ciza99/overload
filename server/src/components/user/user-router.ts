import { t } from "utils/trpc";

import { UserProcedures } from "./user-procedures";

export type UserRouter = ReturnType<typeof userRouterFactory>;

export const userRouterFactory = ({
  userProcedures,
}: {
  userProcedures: UserProcedures;
}) => t.router(userProcedures);
