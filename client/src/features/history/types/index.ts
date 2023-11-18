import { RouterOutputs } from "@features/api/trpc";

export type SessionLog = RouterOutputs["training"]["listSessionLogs"][number];
