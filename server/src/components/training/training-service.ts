import { PrismaClient } from "@prisma/client";

import {
  CreateTemplateSchema,
  CreateTemplateGroupSchema,
  CreateTrainingSchema,
} from "./training-schema";

export type TrainingService = ReturnType<typeof trainingServiceFactory>;

export const trainingServiceFactory = ({ db }: { db: PrismaClient }) => {
  const createTemplate = async (template: CreateTemplateSchema) => {
    return await db.template.create({
      data: template,
    });
  };

  const createTemplateGroup = async (
    templateGroup: CreateTemplateGroupSchema
  ) => {
    return await db.templateGroup.create({ data: templateGroup });
  };

  const createTraining = async (training: CreateTrainingSchema) => {
    return await db.training.create({ data: training });
  };

  const getTemplates = async () => {
    return await db.templateGroup.findMany({
      include: {
        templates: true,
      },
    });
  };

  return {
    createTemplateGroup,
    createTemplate,
    createTraining,
    getTemplates,
  };
};
