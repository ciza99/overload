import { RouterOutputs } from "@utils/trpc";
import { TemplateType } from "../templates/types";

export type SessionType = TemplateType["sessions"][number];
export type SessionExerciseType = SessionType["exercises"][number];
export type SetType = SessionExerciseType["sets"][number];
export type ExerciseType = RouterOutputs["training"]["getExercises"][number];
