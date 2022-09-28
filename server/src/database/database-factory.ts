import { PrismaClient } from "@prisma/client";

export const databaseFactory = () => new PrismaClient();
