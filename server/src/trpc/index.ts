import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export const t = initTRPC.context<Context>().create();

export const createContext = ({ req, res }: CreateExpressContextOptions) => ({
  req,
  res,
});

type Context = inferAsyncReturnType<typeof createContext>;
