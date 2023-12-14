import { PrismaClient, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import {
  CreateTemplateSchema,
  CreateTemplateGroupSchema,
  CreateTrainingSchema,
  SessionSchema,
  SessionLogSchema,
  HistoryFilterSchema,
} from "./training-schema";

export type TrainingService = ReturnType<typeof trainingServiceFactory>;

export const trainingServiceFactory = ({ db }: { db: PrismaClient }) => {
  const createTemplateGroup = async (
    templateGroup: CreateTemplateGroupSchema,
    user: User
  ) => {
    const { _max } = await db.templateGroup.aggregate({
      where: { userId: user.id },
      _max: { sort: true },
    });
    const sort = _max.sort ? _max.sort + 1 : 1;

    return await db.templateGroup.create({
      data: { ...templateGroup, userId: user.id, sort },
    });
  };

  const deleteTemplateGroup = async (id: number, user: User) => {
    return await db.templateGroup.delete({
      where: { id, userId: user.id },
    });
  };

  const createTemplate = async (template: CreateTemplateSchema, user: User) => {
    const { _max } = await db.template.aggregate({
      _max: { sort: true },
    });
    const sort = _max.sort ? _max.sort + 1 : 1;

    return await db.template.create({
      data: { ...template, userId: user.id, sort },
    });
  };

  const deleteTemplate = async (id: number, user: User) => {
    return await db.template.delete({ where: { id, userId: user.id } });
  };

  const createSession = async (input: CreateTrainingSchema, user: User) => {
    const { _max } = await db.session.aggregate({
      _max: { sort: true },
    });
    const template = await db.template.findUnique({
      where: { id: input.templateId },
    });

    if (!template) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Template not found",
      });
    }

    if (template.userId !== user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }

    const sort = _max.sort ? _max.sort + 1 : 1;

    if (input.isRest) {
      const { templateId } = input;
      return await db.session.create({
        data: {
          isRest: true,
          name: "",
          templateId,
          sort,
        },
      });
    }

    const { name, templateId } = input;
    return await db.session.create({
      data: {
        name,
        templateId,
        sort,
      },
    });
  };

  const deleteSession = async (id: number, user: User) => {
    return await db.session.delete({
      where: { id, template: { userId: user.id } },
    });
  };

  const getGroupedTemplates = async (user: User) => {
    return await db.templateGroup.findMany({
      where: { userId: user.id },
      orderBy: { sort: "desc" },
      include: {
        templates: {
          orderBy: { sort: "desc" },
        },
      },
    });
  };

  const getTemplate = async (id: number, user: User) => {
    const template = await db.template.findUnique({
      where: { id, userId: user.id },
      include: {
        sessions: {
          orderBy: { sort: "asc" },
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
    });

    if (!template) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Template not found",
      });
    }

    return template;
  };

  const getExercises = async () => {
    return await db.exercise.findMany({
      include: { bodyParts: { include: { bodyPart: true } } },
    });
  };

  const updateSession = async (session: SessionSchema, user: User) => {
    const deleteExercises = db.sessionExercise.deleteMany({
      where: {
        sessionId: session.id,
        session: { template: { userId: user.id } },
      },
    });
    const updateSession = db.session.update({
      where: { id: session.id, template: { userId: user.id } },
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

  const logSession = async (session: SessionLogSchema, user: User) => {
    if (session.exercises.every(({ sets }) => sets.length === 0)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Session must have at least one set",
      });
    }

    return await db.sessionLog.create({
      data: {
        userId: user.id,
        sessionId: session.id,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        name: session.name,
        exercises: {
          create: session.exercises
            .filter(({ sets }) => sets.length > 0)
            .map(({ exerciseId, sets }) => ({
              exerciseId,
              sets: {
                create: sets.map(({ weight, reps }) => ({ weight, reps })),
              },
            })),
        },
      },
    });
  };

  const listSessionLogs = async (filter: HistoryFilterSchema, user: User) => {
    return await db.sessionLog.findMany({
      where: {
        userId: user.id,
        startedAt: filter,
      },
      orderBy: { startedAt: "desc" },
      include: {
        exercises: {
          include: {
            sets: {
              include: {
                sessionExercise: {
                  include: {
                    exercise: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  };

  const findSessionLog = async (id: number, user: User) => {
    return await db.sessionLog.findUnique({
      where: { id, userId: user.id },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: {
              include: {
                sessionExercise: {
                  include: {
                    exercise: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  };

  const swapTemplateGroups = async (
    [fromId, toId]: [fromId: number, toId: number],
    user: User
  ) => {
    const res = await db.templateGroup.findMany({
      where: { id: { in: [fromId, toId] }, userId: user.id },
    });

    if (res.length !== 2) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Template groups not found",
      });
    }

    const [{ sort: originalSort }, { sort: newSort }] = res.sort((a) =>
      a.id === fromId ? -1 : 1
    );

    if (originalSort === newSort) {
      return;
    }

    const shiftItems =
      newSort < originalSort
        ? db.templateGroup.updateMany({
            where: {
              sort: { gte: newSort, lt: originalSort },
            },
            data: {
              sort: { increment: 1 },
            },
          })
        : db.templateGroup.updateMany({
            where: {
              sort: { gt: originalSort, lte: newSort },
            },
            data: {
              sort: { decrement: 1 },
            },
          });

    const moveToPlace = db.templateGroup.update({
      where: { id: fromId },
      data: { sort: newSort },
    });

    await db.$transaction([shiftItems, moveToPlace]);
  };

  const swapSessions = async (
    [fromId, toId]: [fromId: number, toId: number],
    user: User
  ) => {
    const res = await db.session.findMany({
      where: { id: { in: [fromId, toId] }, template: { userId: user.id } },
      include: {
        template: true,
      },
    });

    if (res.length !== 2) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Sessions not found",
      });
    }

    if (res[0].templateId !== res[1].templateId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Sessions must be in the same template",
      });
    }

    const templateId = res[0].templateId;

    const [{ sort: originalSort }, { sort: newSort }] = res.sort((a) =>
      a.id === fromId ? -1 : 1
    );

    if (originalSort === newSort) {
      return;
    }

    const shiftItems =
      newSort < originalSort
        ? db.session.updateMany({
            where: {
              sort: { gte: newSort, lt: originalSort },
              templateId,
            },
            data: {
              sort: { increment: 1 },
            },
          })
        : db.session.updateMany({
            where: {
              sort: { gt: originalSort, lte: newSort },
              templateId,
            },
            data: {
              sort: { decrement: 1 },
            },
          });

    const moveToPlace = db.session.update({
      where: { id: fromId },
      data: { sort: newSort },
    });

    await db.$transaction([shiftItems, moveToPlace]);
  };

  const swapTemplate = async (
    [fromId, toId]: [fromId: number, toId: number],
    user: User
  ) => {
    const res = await db.template.findMany({
      where: { id: { in: [fromId, toId] }, userId: user.id },
    });

    if (res.length !== 2) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Templates not found",
      });
    }

    const [{ sort: originalSort }, { sort: newSort }] = res.sort((a) =>
      a.id === fromId ? -1 : 1
    );

    if (originalSort === newSort) {
      return;
    }

    const shiftItems =
      newSort < originalSort
        ? db.template.updateMany({
            where: {
              sort: { gte: newSort, lt: originalSort },
            },
            data: {
              sort: { increment: 1 },
            },
          })
        : db.template.updateMany({
            where: {
              sort: { gt: originalSort, lte: newSort },
            },
            data: {
              sort: { decrement: 1 },
            },
          });

    const moveToPlace = db.template.update({
      where: { id: fromId },
      data: { sort: newSort },
    });

    await db.$transaction([shiftItems, moveToPlace]);
  };

  return {
    createTemplateGroup,
    deleteTemplateGroup,
    createTemplate,
    deleteTemplate,
    createSession,
    deleteSession,
    getGroupedTemplates,
    getExercises,
    updateSession,
    logSession,
    listSessionLogs,
    findSessionLog,
    swapSessions,
    swapTemplateGroups,
    swapTemplate,
    getTemplate,
  };
};
