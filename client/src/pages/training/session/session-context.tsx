import { trpc } from "@utils/trpc";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { v4 } from "uuid";
import { SessionType } from "../session/types";
import { useExercises } from "./hooks/useExercises";

type SessionCtxType = {
  session: SessionType;
  exercises: ExerciseT[];
  sets: Record<string, SetT[]>;
  addExercise: (exercise: ExerciseT) => void;
  addSet: (exerciseId: string, set: SetT) => void;
  removeExercise: (id: string) => void;
  removeSet: (id: string) => void;
};

export const SessionCtx = createContext<SessionCtxType>(undefined as never);
export const useSessionCtx = () => useContext(SessionCtx);

export type SetT = {
  id: string;
  reps?: number;
  weight?: number;
};

export type ExerciseT = {
  id: string;
  exerciseId: number;
  setIds: string[];
  name: string;
};

export const SessionProvider = ({
  children,
  session,
}: {
  children: ReactNode;
  session: SessionType;
}) => {
  const idToExercise = useExercises();
  const [initialExercises, initialSets] = useMemo(
    () =>
      session.exercises.reduce<[ExerciseT[], Record<string, SetT[]>]>(
        (acc, exercise) => {
          const sets = exercise.sets.map<SetT>(({ reps, weight }) => ({
            id: v4(),
            reps,
            weight,
          }));
          const setIds = sets.map((set) => set.id);
          const newExercise: ExerciseT = {
            id: v4(),
            exerciseId: exercise.exerciseId,
            setIds,
            name: idToExercise[exercise.exerciseId]?.name,
          };
          return [
            [...acc[0], newExercise],
            { ...acc[1], [newExercise.id]: sets },
          ];
        },
        [[], {}]
      ),
    []
  );
  const [exercises, setExercises] = useState(initialExercises);
  const [sets, setSets] = useState(initialSets);

  const removeExercise = (id: string) =>
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));

  const removeSet = (id: string) =>
    setSets((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([exerciseId, sets]) => [
          exerciseId,
          sets.filter((set) => set.id !== id),
        ])
      )
    );

  const addExercise = (exercise: ExerciseT) =>
    setExercises((prev) => [...prev, exercise]);

  const addSet = (exerciseId: string, set: SetT) =>
    setSets((prev) => {
      const sets = prev[exerciseId];
      return { ...prev, [exerciseId]: [...sets, set] };
    });

  return (
    <SessionCtx.Provider
      value={{
        session,
        exercises,
        sets,
        addExercise,
        removeExercise,
        addSet,
        removeSet,
      }}
    >
      {children}
    </SessionCtx.Provider>
  );
};

// const exposedExercises = useMemo(
//   () =>
//     exercises.map((exercise) => {
//       const exerciseInfo = idToExercise[exercise.exerciseId];
//       return { ...exercise, exerciseInfo };
//     }),
//   [exercises, idToExercise]
// );
//
// const addExercise = (exercise: ExerciseCtxType) => setExercises(prev => [...prev, exercise])
//
// const deleteExercise = (index: number) => setExercises(prev => prev)
//
// const addSet = (exerciseIndex: )
//
// const deleteSet = (exerciseIndex: number, setIndex: number) => {
//   setExercises((prev) =>
//     prev.map((exercise, eIndex) => {
//       if (eIndex !== exerciseIndex) return exercise;
//       return {
//         ...exercise,
//         sets: exercise.sets.filter((_, sIndex) => setIndex !== sIndex),
//       };
//     })
//   );
// };
