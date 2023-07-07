import { authProcedure } from "utils/procedures";
import {
  createTemplateGroupSchema,
  createTemplateSchema,
  createTrainingSchema,
  updateSessionSchema,
  UpdateSessionSchema,
} from "./training-schema";
import z from "zod";

import { TrainingService } from "./training-service";

export type TrainingProcedures = ReturnType<typeof trainingProducersFactory>;

export const trainingProducersFactory = ({
  trainingService,
}: {
  trainingService: TrainingService;
}) => ({
  createTemplateGroup: authProcedure
    .input(createTemplateGroupSchema)
    .mutation(async ({ input, ctx }) => {
      return await trainingService.createTemplateGroup(input, ctx.user);
    }),

  deleteTemplateGroup: authProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await trainingService.deleteTemplateGroup(input.id);
    }),

  createTemplate: authProcedure
    .input(createTemplateSchema)
    .mutation(async ({ input, ctx }) => {
      return await trainingService.createTemplate(input, ctx.user);
    }),

  deleteTemplate: authProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await trainingService.deleteTemplate(input.id);
    }),

  createSession: authProcedure
    .input(createTrainingSchema)
    .mutation(async ({ input }) => {
      return await trainingService.createSession(input);
    }),

  deleteSession: authProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await trainingService.deleteSession(input.id);
    }),

  updateSession: authProcedure
    .input(updateSessionSchema)
    .mutation(async ({ input }) => {
      return await trainingService.updateSession(input);
    }),

  getTemplates: authProcedure.query(async ({ ctx }) => {
    return await trainingService.getTemplates(ctx.user);
  }),

  getExercises: authProcedure.query(async () => {
    return await trainingService.getExercises();
  }),

  dragSwapTemplateGroups: authProcedure
    .input(
      z.object({
        firstId: z.number().nonnegative(),
        secondId: z.number().nonnegative(),
      })
    )
    .mutation(async ({ input }) => {
      //TODO
    }),
});
