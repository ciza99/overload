import { z } from "zod";

export const dateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type ExerciseStatisticsInput = z.infer<
  typeof exerciseStatisticsInputSchema
>;
export const exerciseStatisticsInputSchema = z
  .object({
    exerciseId: z.number().optional(),
    type: z.enum(["Volume", "1RM"]),
  })
  .merge(dateRangeSchema);

export type BodypartDistributionInput = z.infer<
  typeof bodypartDistributionInputSchema
>;
export const bodypartDistributionInputSchema = z
  .object({
    bodypartIds: z.array(z.number()).min(2),
  })
  .merge(dateRangeSchema);
