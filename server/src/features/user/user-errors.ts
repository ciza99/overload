import { TRPCError } from "@trpc/server";

export const createEmailTakenError = () =>
  new TRPCError({
    code: "CONFLICT",
    message: "Email is already taken",
  });

export const createUsernameTakenError = () =>
  new TRPCError({
    code: "CONFLICT",
    message: "Username is already taken",
  });
