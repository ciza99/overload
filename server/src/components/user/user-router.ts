import { t } from "trpc";
import { z } from "zod";

import { UserService } from "./user-service/user-service-types";
import { createUserDto } from "./user-utils";

export type UserRouter = ReturnType<typeof userRouterFactory>;

export const userRouterFactory = ({
  userService,
}: {
  userService: UserService;
}) =>
  t.router({
    add: t.procedure
      .input(
        z
          .object({
            username: z.string().min(4),
            email: z.string().email(),
            password: z.string().min(4),
            repeatPassword: z.string().min(4),
          })
          .required()
          .superRefine(({ password, repeatPassword }, ctx) => {
            if (password === repeatPassword) {
              return;
            }

            ctx.addIssue({
              code: "custom",
              message: "Passwords don't match",
              path: ["repeatPassword"],
            });
          })
      )
      .mutation(async ({ input }) => {
        await userService.checkUsernameOrEmailTaken(input);
        const user = await userService.registerUser(input);

        return createUserDto(user);
      }),
  });
