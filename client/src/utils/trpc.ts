import { createTRPCReact } from "@trpc/react-query";
import type { TRPCRouter } from "../../../server/src/components/router/router";

export type AppRouter = TRPCRouter;
export const trpc = createTRPCReact<AppRouter>();
