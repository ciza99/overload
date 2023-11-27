import { z } from "zod";

export type RoutineUpsertSchema = z.infer<typeof routineUpsertSchema>;
export const routineUpsertSchema = z.object({
  templateId: z.number().nonnegative(),
  shift: z.number().nonnegative().optional(),
});
