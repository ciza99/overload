import { trpc } from "@utils/trpc";
import { createContext, ReactNode, useMemo, useState } from "react";
import { TrainingType } from "./templates/types";

export const SessionCtx = createContext<undefined>(undefined as never);

type SessionExerciseType = {
  exerciseId: number;
  sets: {
    retps: number;
    weight: number;
  }[];
};

const mapSet = (set: TrainingType["exercises"][number]["sets"][number]) => ({
  retps: set.reps,
  weight: set.weight,
});

const mapSessionExercise = (
  exercise: TrainingType["exercises"][number]
): SessionExerciseType => ({
  exerciseId: exercise.id,
  sets: exercise.sets.map(mapSet),
});

export const SessionContext = ({
  children,
  training,
}: {
  children: ReactNode;
  training: TrainingType;
}) => {
  const { data: exerciseOptions } = trpc.training.getExercises.useQuery();
  const [exercises, setExercises] = useState(training.exercises);

  const exerciseOptionsMap = useMemo(() => {
    return (
      exerciseOptions?.reduce<Record<number, (typeof exerciseOptions)[number]>>(
        (acc, opt) => ({ ...acc, [opt.id]: opt }),
        {}
      ) ?? {}
    );
  }, [exerciseOptions]);

  return (
    <SessionCtx.Provider value={undefined}>{children}</SessionCtx.Provider>
  );
};
