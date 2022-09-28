import { PrismaClient } from "@prisma/client";

export const prismaFactory = () => new PrismaClient();
