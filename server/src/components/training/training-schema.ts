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
export const createTrainingSchema = z.object({
  name: z.string().min(4).max(20),
  templateId: z.number(),
  exercises: z.array(trainingExerciseSchema).optional(),
});

export const getTemplatesSchema = z.object({});
