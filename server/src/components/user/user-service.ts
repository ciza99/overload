import { hash } from "argon2";
import { PrismaClient, User } from "@prisma/client";

import { createEmailTakenError, createUsernameTakenError } from "./user-errors";
import { AddUserSchema } from "./user-schema";

export type UserService = ReturnType<typeof userServiceFactory>;

type FindUserWithEmail = {
  (email: string): Promise<User | null>;
  <T extends Error = Error>(email: string, error: T | (() => T)): Promise<User>;
};

type FindUserWithUsername = {
  (username: string): Promise<User | null>;
  <T extends Error = Error>(
    username: string,
    error: T | (() => T)
  ): Promise<User>;
};

export const userServiceFactory = ({ db }: { db: PrismaClient }) => {
  const findUserWithEmail: FindUserWithEmail = async (
    email: string,
    error?: Error | (() => Error)
  ): Promise<any> => {
    const user = await db.user.findFirst({
      where: { email: { equals: email } },
    });

    if (!user && error) {
      throw error instanceof Function ? error() : error;
    }

    return user;
  };

  const findUserWithUsername: FindUserWithUsername = async (
    username: string,
    error?: Error | (() => Error)
  ): Promise<any> => {
    const user = await db.user.findFirst({ where: { username } });

    if (!user && error) {
      throw error instanceof Function ? error() : error;
    }

    return user;
  };

  const checkUsernameOrEmailTaken = async ({
    username,
    email,
  }: Pick<User, "username" | "email">) => {
    const user = await db.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    const { username: foundUsername, email: foundEmail } = user ?? {};

    if (username === foundUsername) {
      throw createUsernameTakenError();
    }

    if (email === foundEmail) {
      throw createEmailTakenError();
    }
  };

  const registerUser = async ({
    repeatPassword,
    password,
    ...rest
  }: AddUserSchema) => {
    const hashedPassword = await hash(password);

    const user = await db.user.create({
      data: { ...rest, password: hashedPassword },
    });

    return user;
  };

  return {
    findUserWithEmail,
    findUserWithUsername,
    checkUsernameOrEmailTaken,
    registerUser,
  };
};
