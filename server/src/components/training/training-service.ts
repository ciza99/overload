import { PrismaClient, User } from "@prisma/client";

import {
  CreateTemplateSchema,
  CreateTemplateGroupSchema,
  CreateTrainingSchema,
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

  return {
    createTemplateGroup,
    deleteTemplateGroup,
    createTemplate,
    deleteTemplate,
    createSession,
    deleteSession,
    getTemplates,
    getExercises,
  };
};
