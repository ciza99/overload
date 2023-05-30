import { procedure } from "utils/procedures";
import { createUserDto } from "components/user/user-utils";
import { UserService } from "components/user/user-service";

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
