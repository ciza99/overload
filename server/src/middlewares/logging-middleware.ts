import { t } from "utils/trpc";

export const loggingMiddlewareFactory = (enabled = true) =>
  t.middleware(async ({ ctx, next, path }) => {
    const res = await next();

    if (enabled) {
      console.log(`[${ctx.req.method}] ${path}`, { ctx, res });
    }

    return res;
  });
