import { User } from "@prisma/client";

import { RegistrationBody } from "../types";

export type UserService = {
  findUserWithEmail: FindUserWithEmail;
  findUserWithUsername: FindUserWithUsername;
  checkUsernameOrEmailTaken: CheckUsernameOrEmailTaken;
  registerUser: RegisterUser;
};

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

type CheckUsernameOrEmailTaken = (
  props: Pick<User, "username" | "email">
) => Promise<void>;

type RegisterUser = (props: RegistrationBody) => Promise<User>;
