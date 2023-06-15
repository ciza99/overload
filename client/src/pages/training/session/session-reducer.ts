import { Reducer } from "react";

type SetT = {
  reps?: number;
  weight?: number;
};

type ExerciseT = {
  exerciseId: number;
  order: number;
  sets: SetT[];
};

type Action =
  | { type: "add-exercise"; exercise: ExerciseT }
  | { type: "remove-exercise"; index: number }
  | { type: "add-set"; exerciseIndex: number; set: SetT }
  | { type: "remove-set"; index: [exerciseIndex: number, setIndex: number] };

const exercisesReducer: Reducer<ExerciseT[], Action> = (state, action) => {};
