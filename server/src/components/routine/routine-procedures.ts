import { authProcedure } from "utils/procedures";
import { routineUpsertSchema } from "./routine-schema";
import { RoutineService } from "./routine-service";

export type RoutineProcedures = ReturnType<typeof routineProceduresFactory>;

export const routineProceduresFactory = ({
  routineService,
}: {
  routineService: RoutineService;
}) => ({
  selectRoutine: authProcedure
    .input(routineUpsertSchema)
    .mutation(async ({ input, ctx }) => {
      return await routineService.selectRoutine(input, ctx.user);
    }),

  getRoutine: authProcedure.query(async ({ ctx }) => {
    return await routineService.getRoutine(ctx.user);
  }),
});
