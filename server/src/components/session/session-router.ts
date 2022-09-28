import { t } from "trpc";

import { SessionProcedures } from "./session-procedures";

export type SessionRouter = ReturnType<typeof sessionRouterFactory>;

export const sessionRouterFactory = ({
  sessionProcedures,
}: {
  sessionProcedures: SessionProcedures;
}) => {
  const { get, login, logout, refreshAuthToken } = sessionProcedures;

  return t.router({
    get,
    login,
    logout,
    refreshAuthToken,
  });
};
