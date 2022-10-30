import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.user.create({
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
};

(async () => await seed())();
