import { authProcedure } from "utils/procedures";
import {
  createTemplateGroupSchema,
  createTemplateSchema,
  createTrainingSchema,
  historyFilterSchema,
  sessionLogSchema,
  sessionSchema,
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
    .mutation(async ({ input, ctx }) => {
      return await trainingService.deleteTemplateGroup(input.id, ctx.user);
    }),

  createTemplate: authProcedure
    .input(createTemplateSchema)
    .mutation(async ({ input, ctx }) => {
      return await trainingService.createTemplate(input, ctx.user);
    }),

  deleteTemplate: authProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await trainingService.deleteTemplate(input.id, ctx.user);
    }),

  createSession: authProcedure
    .input(createTrainingSchema)
    .mutation(async ({ input, ctx }) => {
      return await trainingService.createSession(input, ctx.user);
    }),

  deleteSession: authProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await trainingService.deleteSession(input.id, ctx.user);
    }),

  updateSession: authProcedure
    .input(sessionSchema)
    .mutation(async ({ input, ctx }) => {
      return await trainingService.updateSession(input, ctx.user);
    }),

  getGroupedTemplates: authProcedure.query(async ({ ctx }) => {
    return await trainingService.getGroupedTemplates(ctx.user);
  }),

  getTemplate: authProcedure
    .input(z.object({ id: z.number().nonnegative() }))
    .query(async ({ input, ctx }) => {
      return await trainingService.getTemplate(input.id, ctx.user);
    }),

  getExercises: authProcedure.query(async () => {
    return await trainingService.getExercises();
  }),

  logSession: authProcedure
    .input(sessionLogSchema)
    .mutation(async ({ ctx, input }) => {
      return await trainingService.logSession(input, ctx.user);
    }),

  listSessionLogs: authProcedure
    .input(historyFilterSchema)
    .query(async ({ input, ctx }) => {
      return await trainingService.listSessionLogs(input, ctx.user);
    }),

  dragSwapSession: authProcedure
    .input(
      z
        .object({
          fromId: z.number().nonnegative(),
          toId: z.number().nonnegative(),
        })
        .refine((input) => input.fromId !== input.toId, "Ids must be different")
    )
    .mutation(async ({ input, ctx }) => {
      return await trainingService.swapSessions(
        [input.fromId, input.toId],
        ctx.user
      );
    }),
});
