import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

const seed = async () => {
  const user = await prisma.user.create({
    data: {
      username: "mike",
      email: "mike@gmail.com",
      password: await hash("1234"),
    },
  });

  await prisma.exercise.createMany({
    data: [
      { id: 1, name: "Bench Press" },
      { id: 2, name: "Squat" },
      { id: 3, name: "Deadlift" },
    ],
  });

  await prisma.bodyPart.createMany({
    data: [
      { id: 1, name: "Chest" },
      { id: 2, name: "Back" },
      { id: 3, name: "Shoulders" },
      { id: 4, name: "Biceps" },
      { id: 5, name: "Triceps" },
      { id: 6, name: "Legs" },
    ],
  });

  await prisma.exerciseBodyPart.createMany({
    data: [
      { exerciseId: 1, bodyPartId: 1 },
      { exerciseId: 1, bodyPartId: 5 },
      { exerciseId: 2, bodyPartId: 6 },
      { exerciseId: 3, bodyPartId: 2 },
      { exerciseId: 3, bodyPartId: 4 },
    ],
  });

  await prisma.templateGroup.createMany({
    data: [
      { id: 1, name: "Bodybuilding", sort: 1, userId: user.id },
      { id: 2, name: "Powerlifting", sort: 2, userId: user.id },
    ],
  });

  await prisma.template.createMany({
    data: [
      {
        id: 1,
        name: "David Laid 6 Day PPL",
        sort: 1,
        userId: user.id,
        templateGroupId: 1,
      },
      {
        id: 2,
        name: "Simeon Panda 5 Day Split",
        sort: 2,
        userId: user.id,
        templateGroupId: 1,
      },
      {
        id: 3,
        name: "5/3/1",
        sort: 2,
        userId: user.id,
        templateGroupId: 1,
      },
      {
        id: 4,
        name: "5/3/1",
        sort: 2,
        userId: user.id,
        templateGroupId: 2,
      },
    ],
  });

  await prisma.session.createMany({
    data: [
      { name: "Back and biceps", sort: 1, templateId: 1 },
      { name: "Chest and triceps", sort: 2, templateId: 1 },
      { name: "Legs", sort: 3, templateId: 1 },
      { name: "Shoulders", sort: 4, templateId: 1 },
    ],
  });

  await prisma.sessionExercise.createMany({
    data: [
      { id: 1, exerciseId: 1, sessionId: 1 },
      { id: 2, exerciseId: 2, sessionId: 1 },
      { id: 3, exerciseId: 3, sessionId: 1 },
    ],
  });

  await prisma.exerciseSet.createMany({
    data: [
      { id: 1, reps: 3, weight: 125, sessionExerciseId: 1 },
      { id: 2, reps: 8, weight: 100, sessionExerciseId: 1 },
      { id: 3, reps: 8, weight: 100, sessionExerciseId: 1 },
      { id: 4, reps: 8, weight: 100, sessionExerciseId: 1 },
      //
      { id: 5, reps: 10, weight: 45, sessionExerciseId: 2 },
      { id: 6, reps: 10, weight: 45, sessionExerciseId: 2 },
      { id: 7, reps: 10, weight: 45, sessionExerciseId: 2 },
      //
      { id: 8, reps: 10, weight: 45, sessionExerciseId: 3 },
      { id: 9, reps: 10, weight: 45, sessionExerciseId: 3 },
      { id: 10, reps: 10, weight: 45, sessionExerciseId: 3 },
    ],
  });
};

(async () => await seed())();
