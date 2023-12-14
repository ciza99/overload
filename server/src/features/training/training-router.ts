import { t } from "features/api/trpc";

import { TrainingProcedures } from "./training-procedures";

export type TrainingRouter = ReturnType<typeof trainingRouterFactory>;

export const trainingRouterFactory = ({
  trainingProcedures,
}: {
  trainingProcedures: TrainingProcedures;
}) => t.router(trainingProcedures);
