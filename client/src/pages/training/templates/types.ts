import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@utils/trpc";

export type TemplateGroupType =
  inferRouterOutputs<AppRouter>["training"]["getTemplates"][number];
export type TemplateType = TemplateGroupType["templates"][number];
export type TrainingType = TemplateType["trainings"][number];
export type TrainingExerciseType = TrainingType["exercises"][number];
export type SetType = TrainingExerciseType["sets"][number];
