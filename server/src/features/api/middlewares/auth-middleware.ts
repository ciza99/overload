import { t } from "features/api/trpc";
import { createUnauthorizedError } from "features/session/session-errors";

export const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) throw createUnauthorizedError();

  return next({ ctx });
});
