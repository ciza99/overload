import { createTRPCReact } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { TRPCRouter } from "../../../../server/src/components/router/router";

export type AppRouter = TRPCRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export const trpc = createTRPCReact<AppRouter>();
