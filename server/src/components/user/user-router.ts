import { t } from "utils/trpc";
import { addUserSchema } from "./user-schema";

import { UserService } from "./user-service";
import { createUserDto } from "./user-utils";

export type UserRouter = ReturnType<typeof userRouterFactory>;

export const userRouterFactory = ({
  userService,
}: {
  userService: UserService;
}) =>
  t.router({
    add: t.procedure.input(addUserSchema).mutation(async ({ input }) => {
      await userService.checkUsernameOrEmailTaken(input);
      const user = await userService.registerUser(input);

      return createUserDto(user);
    }),
  });
