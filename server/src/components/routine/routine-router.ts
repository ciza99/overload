import { t } from "utils/trpc";
import { RoutineProcedures } from "./routine-procedures";

export type RoutineRouter = ReturnType<typeof routineRouterFactory>;

export const routineRouterFactory = ({
  routineProcedures,
}: {
  routineProcedures: RoutineProcedures;
}) => t.router(routineProcedures);
