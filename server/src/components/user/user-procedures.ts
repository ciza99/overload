import { t } from "utils/trpc";
import { createUserDto } from "components/user/user-utils";
import { UserService } from "components/user/user-service";

import { addUserSchema } from "./user-schema";

export type UserProducers = ReturnType<typeof userProducersFactory>;

export const userProducersFactory = ({
  userService,
}: {
  userService: UserService;
}) => ({
  add: t.procedure.input(addUserSchema).mutation(async ({ input }) => {
    await userService.checkUsernameOrEmailTaken(input);
    const user = await userService.registerUser(input);

    return createUserDto(user);
  }),
});
