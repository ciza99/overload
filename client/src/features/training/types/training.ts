import { RouterOutputs } from "@features/api/trpc";

import { TemplateType } from "./template";

export type SessionType = TemplateType["sessions"][number];
export type SessionExerciseType = SessionType["exercises"][number];
export type SetType = SessionExerciseType["sets"][number];
export type ExerciseType = RouterOutputs["training"]["getExercises"][number];

export type SetFormType = {
  reps: string;
  weight: string;
};
export type ExerciseFormType = {
  exerciseId: number;
  name: string;
  sets: SetFormType[];
};
export type SessionFormType = {
  id: number;
  exercises: ExerciseFormType[];
  name: string;
};
