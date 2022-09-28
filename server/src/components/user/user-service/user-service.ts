import { hash } from "argon2";
import { PrismaClient } from "@prisma/client";

import { UserService } from "./user-service-types";
import {
  createEmailTakenError,
  createUsernameTakenError,
} from "../user-errors";

export const userServiceFactory = ({
  db,
}: {
  db: PrismaClient;
}): UserService => {
  const findUserWithEmail: UserService["findUserWithEmail"] = async (
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

  const findUserWithUsername: UserService["findUserWithUsername"] = async (
    username: string,
    error?: Error | (() => Error)
  ): Promise<any> => {
    const user = await db.user.findFirst({ where: { username } });

    if (!user && error) {
      throw error instanceof Function ? error() : error;
    }

    return user;
  };

  const checkUsernameOrEmailTaken: UserService["checkUsernameOrEmailTaken"] =
    async ({ username, email }) => {
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

  const registerUser: UserService["registerUser"] = async ({
    repeatPassword,
    password,
    ...rest
  }) => {
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
