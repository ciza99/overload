import { Request } from "express";
import { User } from "@prisma/client";

import { createUnauthorizedError } from "components/session/session-errors";

export const createUserDto = (user: User): Omit<User, "password"> => ({
  id: user.id,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  email: user.email,
  birthDate: user.birthDate,
  username: user.username,
});

export const getUserContext = (req: Request) => {
  if (!req.user) {
    throw createUnauthorizedError();
  }

  return req.user;
};
