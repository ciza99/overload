import { useMemo } from "react";
import { trpc } from "@utils/trpc";

export const useExercises = () => {
  const { data: exerciseOptions } = trpc.training.getExercises.useQuery();

  const idToExercise = useMemo(() => {
    return (
      exerciseOptions?.reduce<Record<number, (typeof exerciseOptions)[number]>>(
        (acc, opt) => ({ ...acc, [opt.id]: opt }),
        {}
      ) ?? {}
    );
  }, [exerciseOptions]);

  return idToExercise;
};
