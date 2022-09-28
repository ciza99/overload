import * as yup from "yup";

import { passwordSchema } from "modules/login/login-schema";

export const signUpSchema = yup
  .object({
    username: yup
      .string()
      .min(4, "Username is too short")
      .required("Username is required"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: passwordSchema,
    repeatPassword: yup
      .string()
      .required("Repeat password is required")
      .oneOf([yup.ref("password")], "Passwords dont match"),
  })
  .required();
