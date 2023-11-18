import { SessionFormType, SessionLogInputType } from "../types/training";

const numberStringToNumber = (value: string) => {
  if (value === "") return null;
  return Number(value.replace(",", "."));
};

export const sessionFormToUploadFormat = (form: SessionFormType) => {
  return {
    ...form,
    exercises: form.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map<{ reps: number | null; weight: number | null }>(
        ({ reps, weight }) => ({
          reps: numberStringToNumber(reps),
          weight: numberStringToNumber(weight),
        })
      ),
    })),
  };
};

export const sessionFormToLogFormat = (
  form: SessionFormType,
  { startedAt, endedAt }: { startedAt: Date; endedAt: Date }
): SessionLogInputType => {
  console.log(form);
  return {
    startedAt,
    endedAt,
    ...form,
    exercises: form.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets
        .filter(({ completed }) => completed)
        .map<{ reps: number | null; weight: number | null }>(
          ({ reps, weight }) => ({
            reps: numberStringToNumber(reps),
            weight: numberStringToNumber(weight),
          })
        ),
    })),
  };
};
