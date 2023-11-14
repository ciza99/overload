import { useMemo } from "react";

import { ExerciseType } from "../types/training";

export const useIdToExercise = (exercises: ExerciseType[]) => {
  const idToExercise = useMemo(() => {
    return (
      exercises?.reduce<Record<number, ExerciseType>>(
        (acc, opt) => ({ ...acc, [opt.id]: opt }),
        {}
      ) ?? {}
    );
  }, [exercises]);

  return idToExercise;
};
