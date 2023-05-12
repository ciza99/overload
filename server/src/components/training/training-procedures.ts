import { t } from "utils/trpc";
import {
  createTemplateGroupSchema,
  createTemplateSchema,
  createTrainingSchema,
} from "./training-schema";
import z from "zod";

import { TrainingService } from "./training-service";

export type TrainingProcedures = ReturnType<typeof trainingProducersFactory>;

export const trainingProducersFactory = ({
  trainingService,
}: {
  trainingService: TrainingService;
}) => ({
  createTemplateGroup: t.procedure
    .input(createTemplateGroupSchema)
    .mutation(async ({ input }) => {
      return await trainingService.createTemplateGroup(input);
    }),

  deleteTemplateGroup: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await trainingService.deleteTemplateGroup(input.id);
    }),

  createTemplate: t.procedure
    .input(createTemplateSchema)
    .mutation(async ({ input }) => {
      return await trainingService.createTemplate(input);
    }),

  deleteTemplate: t.procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await trainingService.deleteTemplate(input.id);
    }),

  createTraining: t.procedure
    .input(createTrainingSchema)
    .mutation(async ({ input }) => {
      return await trainingService.createTraining(input);
    }),

  getTemplates: t.procedure.query(async () => {
    return await trainingService.getTemplates();
  }),
});
