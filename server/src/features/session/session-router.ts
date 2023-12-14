import { t } from "features/api/trpc";

import { SessionProcedures } from "./session-procedures";

export type SessionRouter = ReturnType<typeof sessionRouterFactory>;

export const sessionRouterFactory = ({
  sessionProcedures,
}: {
  sessionProcedures: SessionProcedures;
}) => t.router(sessionProcedures);
