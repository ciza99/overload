import { useCallback } from "react";
import {
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { Formik } from "formik";
import { StackActions, useNavigation } from "@react-navigation/native";
import { z } from "zod";

import { trpc } from "@utils/trpc";
import { useFormikValidation } from "@hooks/use-formik-validation";
import {
  Typography,
  TextField,
  TextButton,
  SubmitButton,
  Icon,
} from "@components/common";
import { passwordSchema } from "@schemas";
import Animated, { StretchInY, StretchOutY } from "react-native-reanimated";

type SignupSchema = z.infer<typeof signUpSchema>;

const signUpSchema = z
  .object({
    username: z.string().min(4, "Username is too short"),
    email: z.string().email("Email is invalid"),
    password: passwordSchema,
    repeatPassword: z.string(),
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

export const SignUp = () => {
  const { dispatch } = useNavigation();
  const validate = useFormikValidation(signUpSchema);

  const { error, mutate, isLoading } = trpc.users.add.useMutation({
    onSuccess: () => dispatch(StackActions.replace("login")),
  });

  const onSubmit = useCallback(
    (values: SignupSchema) => mutate(values),
    [mutate]
  );

  const navigateToLogin = useCallback(
    () => dispatch(StackActions.replace("login")),
    [dispatch]
  );

  return (
    <Formik
      initialValues={{
        username: "mike",
        email: "mike@gmail.com",
        password: "1234",
        repeatPassword: "1234",
      }}
      onSubmit={onSubmit}
      validate={validate}
    >
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={100}
        enabled
        className="grow"
      >
        <View className="grow">
          <TouchableWithoutFeedback className="grow" onPress={Keyboard.dismiss}>
            <View className="px-7 my-auto">
              <Typography weight="bold" className="text-3xl text-center">
                Overload
              </Typography>
              <Typography weight="bold" className="text-lg mb-10 text-center">
                Track your progress and see results.
              </Typography>
              <TextField
                label="Username:"
                name="username"
                textContentType="username"
                placeholder="johndoe@gmail.com"
                className="mb-5"
              />
              <TextField
                label="Email:"
                name="email"
                textContentType="emailAddress"
                placeholder="johndoe@gmail.com"
                className="mb-5"
              />
              <TextField
                label="Password:"
                name="password"
                textContentType="newPassword"
                placeholder="************"
                className="mb-5"
                secureTextEntry={true}
              />
              <TextField
                label="Repeat password:"
                name="repeatPassword"
                textContentType="newPassword"
                placeholder="************"
                className="mb-8"
                secureTextEntry={true}
              />
              <SubmitButton
                onPress={Keyboard.dismiss}
                beforeIcon={<Icon name="create-outline" />}
                className="mb-2"
                loading={isLoading}
              >
                Sign up
              </SubmitButton>
              {error && (
                <Animated.View entering={StretchInY} exiting={StretchOutY}>
                  <Typography className="text-danger text-sm text-center">
                    {error.message}
                  </Typography>
                </Animated.View>
              )}
              <View className="flex flex-row justify-center pt-8 gap-2">
                <Typography>Already have an account?</Typography>
                <TextButton onPress={navigateToLogin} className="text-primary">
                  Log in
                </TextButton>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </Formik>
  );
};
