import { t } from "utils/trpc";
import { createUnauthorizedError } from "components/session/session-errors";

export const authMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw createUnauthorizedError();
  }

  return next({ ctx });
});
