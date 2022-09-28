import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

import { userServiceFactory } from "./user-service";
import { UserService } from "./user-service-types";

describe("UserService", () => {
  describe("checkUsernameOrEmailTaken", () => {
    let db: DeepMockProxy<PrismaClient>;
    let userService: UserService;

    beforeEach(() => {
      db = mockDeep();
      userService = userServiceFactory({ db });
    });

    it("does not throw when username and email are not taken", async () => {
      const username = "mike";
      const email = "mike@gmail.com";

      db.user.findFirst.mockResolvedValue(null);

      await expect(
        userService.checkUsernameOrEmailTaken({ username, email })
      ).resolves.toBeUndefined();
    });

    it("throws when username is taken", async () => {
      const username = "mike";
      const email = "mike@gmail.com";

      db.user.findFirst.mockResolvedValue({
        username,
        id: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        email: "",
        password: "",
        birthDate: new Date(),
      });

      await expect(() =>
        userService.checkUsernameOrEmailTaken({ username, email })
      ).rejects.toThrow();
    });

    it("throws when email is taken", async () => {
      const username = "mike";
      const email = "mike@gmail.com";

      db.user.findFirst.mockResolvedValue({
        username: "",
        id: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        email,
        password: "",
        birthDate: new Date(),
      });

      await expect(
        userService.checkUsernameOrEmailTaken({ username, email })
      ).rejects.toThrow();
    });
  });
});
