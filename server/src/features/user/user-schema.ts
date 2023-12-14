import { z } from "zod";

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const createUserSchema = z
  .object({
    username: z.string().min(4),
    email: z.string().email(),
    password: z.string().min(4),
    repeatPassword: z.string().min(4),
  })
  .required()
  .superRefine(({ password, repeatPassword }, ctx) => {
    if (password === repeatPassword) return;

    ctx.addIssue({
      code: "custom",
      message: "Passwords don't match",
      path: ["repeatPassword"],
    });
  });
