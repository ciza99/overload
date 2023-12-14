import { createTRPCReact } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { TRPCRouter } from "../../../../server/src/features/api/router-factory";

export type AppRouter = TRPCRouter;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export const trpc = createTRPCReact<AppRouter>();
