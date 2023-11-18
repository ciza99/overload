import { localeInfo } from "@features/core/constants/locale";

import {
  ExerciseFormType,
  ExerciseType,
  SessionFormType,
  SessionType,
  SetFormType,
} from "../types/training";

const numberToFormInput = (value: number | undefined | null) => {
  if (value === undefined || value === null) return "";
  return value.toLocaleString(localeInfo.languageTag);
};

export const sessionToFormValues = (
  session: SessionType,
  exercises: ExerciseType[]
): SessionFormType => {
  const sessionExercises = session.exercises.reduce<ExerciseFormType[]>(
    (acc, exercise) => {
      const sets = exercise.sets.map<SetFormType>(({ reps, weight }) => ({
        reps: numberToFormInput(reps),
        weight: numberToFormInput(weight),
        completed: false,
      }));

      const newExercise: ExerciseFormType = {
        exerciseId: exercise.exerciseId,
        sets,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        name: exercises.find(({ id }) => id === exercise.exerciseId)!.name,
      };

      return [...acc, newExercise];
    },
    []
  );

  return { exercises: sessionExercises, id: session.id, name: session.name };
};
