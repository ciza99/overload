import { z } from "zod";

import { passwordSchema } from "modules/login/login-schema";

export type SignupSchema = z.infer<typeof signUpSchema>;

export const signUpSchema = z
  .object({
    username: z.string().min(4, "Username is too short"),
    email: z.string().email("Email is invalid"),
    password: passwordSchema,
    repeatPassword: z.string(),
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
  });
