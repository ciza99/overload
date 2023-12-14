import { procedure } from "features/api/procedures";
import { createUserDto } from "features/user/user-utils";
import { UserService } from "features/user/user-service";

import { createUserSchema } from "./user-schema";

export type UserProcedures = ReturnType<typeof userProceduresFactory>;

export const userProceduresFactory = ({
  userService,
}: {
  userService: UserService;
}) => ({
  create: procedure.input(createUserSchema).mutation(async ({ input }) => {
    await userService.checkUsernameOrEmailTaken(input);
    const user = await userService.registerUser(input);

    return createUserDto(user);
  }),
});
