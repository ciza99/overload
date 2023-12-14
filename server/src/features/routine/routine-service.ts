import { PrismaClient, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { RoutineUpsertSchema } from "./routine-schema";

export type RoutineService = ReturnType<typeof routineServiceFactory>;

export const routineServiceFactory = ({ db }: { db: PrismaClient }) => {
  const selectRoutine = async (
    { templateId, shift }: RoutineUpsertSchema,
    user: User
  ) => {
    const template = await db.template.findUnique({
      where: { id: templateId },
      include: {
        sessions: true,
      },
    });

    if (!template) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Template not found" });
    }

    const normalizedShift = (shift ?? 0) % template.sessions.length;

    await db.routine.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        templateId,
        startedAt: new Date(),
        shift: normalizedShift,
      },
      update: {
        templateId,
        startedAt: new Date(),
        shift: normalizedShift,
      },
    });
  };

  const getRoutine = (user: User) => {
    return db.routine.findUnique({
      where: { userId: user.id },
      include: {
        template: {
          include: {
            sessions: {
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
            },
          },
        },
      },
    });
  };

  return { selectRoutine, getRoutine };
};
