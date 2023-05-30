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

  const createTraining = async ({ name, templateId }: CreateTrainingSchema) => {
    return await db.training.create({
      data: {
        name,
        templateId,
      },
    });
  };

  const deleteTraining = async (id: number) => {
    return await db.training.delete({ where: { id } });
  };

  const getTemplates = async (user: User) => {
    return await db.templateGroup.findMany({
      where: { userId: user.id },
      include: {
        templates: {
          include: {
            trainings: {
              include: {
                exercises: {
                  include: {
                    sets: {
                      include: {
                        trainingExercise: true,
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
    createTraining,
    deleteTraining,
    getTemplates,
    getExercises,
  };
};
