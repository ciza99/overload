import { User } from "@prisma/client";

export const createUserDto = (user: User): Omit<User, "password"> => ({
  id: user.id,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  email: user.email,
  birthDate: user.birthDate,
  username: user.username,
});
