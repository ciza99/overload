import { z } from "zod";

export const passwordSchema = z.string().min(4, "Password is too short");

export type LoginSchema = z.infer<typeof loginSchema>;

export const loginSchema = z
  .object({
    email: z.string().email("Email is invalid"),
    password: passwordSchema,
  })
  .required();
