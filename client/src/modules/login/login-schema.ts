import * as yup from "yup";

export const passwordSchema = yup
  .string()
  .min(4, "Password is too short")
  .required("Password is required");

export const loginSchema = yup
  .object({
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: passwordSchema,
  })
  .required();
