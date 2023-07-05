import { PrismaClient, User } from "@prisma/client";

import {
  CreateTemplateSchema,
  CreateTemplateGroupSchema,
  CreateTrainingSchema,
  UpdateSessionSchema,
} from "./training-schema";

export type TrainingService = ReturnType<typeof trainingServiceFactory>;

export const trainingServiceFactory = ({ db }: { db: PrismaClient }) => {
  const createTemplateGroup = async (
    templateGroup: CreateTemplateGroupSchema,
    user: User
  ) => {
    return await db.templateGroup.create({
      data: { ...templateGroup, userId: user.id },
    });
  };

  const deleteTemplateGroup = async (id: number) => {
    return await db.templateGroup.delete({
      where: { id },
    });
  };

  const createTemplate = async (template: CreateTemplateSchema, user: User) => {
    return await db.template.create({
      data: { ...template, userId: user.id },
    });
  };

  const deleteTemplate = async (id: number) => {
    return await db.template.delete({ where: { id } });
  };

  const createSession = async ({ name, templateId }: CreateTrainingSchema) => {
    return await db.session.create({
      data: {
        name,
        templateId,
      },
    });
  };

  const deleteSession = async (id: number) => {
    return await db.session.delete({ where: { id } });
  };

  const getTemplates = async (user: User) => {
    return await db.templateGroup.findMany({
      where: { userId: user.id },
      include: {
        templates: {
          include: {
            sessions: {
              include: {
                exercises: {
                  include: {
                    sets: {
                      include: {
                        sessionExercise: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  };

  const getExercises = async () => {
    return await db.exercise.findMany({ include: { bodyParts: true } });
  };

  const updateSession = async (session: UpdateSessionSchema) => {
    const deleteExercises = db.sessionExercise.deleteMany({
      where: { sessionId: session.id },
    });
    const updateSession = db.session.update({
      where: { id: session.id },
      data: {
        name: session.name,
        exercises: {
          create: session.exercises.map(({ exerciseId, sets }) => ({
            exerciseId,
            sets: {
              create: sets.map(({ weight, reps }) => ({ weight, reps })),
            },
          })),
        },
      },
    });

    const [, updatedSession] = await db.$transaction([
      deleteExercises,
      updateSession,
    ]);

    return updatedSession;
  };

  return {
    createTemplateGroup,
    deleteTemplateGroup,
    createTemplate,
    deleteTemplate,
    createSession,
    deleteSession,
    getTemplates,
    getExercises,
    updateSession,
  };
};
