import { TRPCError } from "@trpc/server";

export const createLoginError = () =>
  new TRPCError({
    code: "UNAUTHORIZED",
    message: "Incorrect username or password",
  });

export const createUnauthorizedError = () =>
  new TRPCError({
    code: "UNAUTHORIZED",
    message: "Unauthorized",
  });
