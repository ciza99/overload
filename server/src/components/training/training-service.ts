import { PrismaClient } from "@prisma/client";

import {
  CreateTemplateSchema,
  CreateTemplateGroupSchema,
  CreateTrainingSchema,
} from "./training-schema";

export type TrainingService = ReturnType<typeof trainingServiceFactory>;

export const trainingServiceFactory = ({ db }: { db: PrismaClient }) => {
  const createTemplateGroup = async (
    templateGroup: CreateTemplateGroupSchema
  ) => {
    return await db.templateGroup.create({ data: templateGroup });
  };

  const deleteTemplateGroup = async (id: number) => {
    return await db.templateGroup.delete({
      where: { id },
    });
  };

  const createTemplate = async (template: CreateTemplateSchema) => {
    return await db.template.create({
      data: template,
    });
  };

  const deleteTemplate = async (id: number) => {
    return await db.template.delete({ where: { id } });
  };

  const createTraining = async (training: CreateTrainingSchema) => {
    return await db.training.create({ data: training });
  };

  const getTemplates = async () => {
    return await db.templateGroup.findMany({
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

  return {
    createTemplateGroup,
    deleteTemplateGroup,
    createTemplate,
    deleteTemplate,
    createTraining,
    getTemplates,
  };
};
