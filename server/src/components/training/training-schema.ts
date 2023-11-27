import { isBefore, isPast } from "date-fns";
import z from "zod";

export type CreateTemplateGroupSchema = z.infer<
  typeof createTemplateGroupSchema
>;
export const createTemplateGroupSchema = z.object({
  name: z.string().min(4).max(20),
});

export type CreateTemplateSchema = z.infer<typeof createTemplateSchema>;
export const createTemplateSchema = z.object({
  name: z.string(),
  templateGroupId: z.number(),
});

const exerciseSetSchema = z.object({
  weight: z.number().min(0).max(1000),
  reps: z.number().min(0).max(100),
});

const trainingExerciseSchema = z.object({
  exerciseId: z.number(),
  sets: z.array(exerciseSetSchema).min(1).max(50),
});

export type CreateTrainingSchema = z.infer<typeof createTrainingSchema>;
export const createTrainingSchema = z.discriminatedUnion("isRest", [
  z.object({
    isRest: z.literal(false),
    name: z.string().min(4).max(20),
    templateId: z.number(),
  }),
  z.object({
    isRest: z.literal(true),
    templateId: z.number(),
  }),
]);

export const getTemplatesSchema = z.object({});

export type SessionSchema = z.infer<typeof sessionSchema>;
export const sessionSchema = z.object({
  id: z.number(),
  name: z.string(),
  exercises: z.array(
    z.object({
      exerciseId: z.number().positive(),
      sets: z.array(
        z.object({
          weight: z.number().nonnegative().nullable(),
          reps: z.number().positive().nullable(),
        })
      ),
    })
  ),
});

export type SessionLogSchema = z.infer<typeof sessionLogSchema>;
export const sessionLogSchema = sessionSchema
  .extend({
    startedAt: z.coerce
      .date()
      .refine((date) => isPast(date), { message: "Date must be in the past" }),
    endedAt: z.coerce
      .date()
      .refine((date) => isPast(date), { message: "Date must be in the past" }),
  })
  .refine(({ startedAt, endedAt }) => isBefore(startedAt, endedAt), {
    message: "Ended at must be after started at",
  });

export type HistoryFilterSchema = z.infer<typeof historyFilterSchema>;
export const historyFilterSchema = z
  .object({
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
  })
  .optional();
