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

import {
  Typography,
  Paper,
  TextField,
  Button,
  TextButton,
  SubmitButton,
  Divider,
  Icon,
} from "@components/common";
import { tokenHandler } from "@utils/token-handler";
import { trpc } from "@utils/trpc";
import { useFormikValidation } from "@hooks/use-formik-validation";
import { passwordSchema } from "@schemas";
import Animated from "react-native-reanimated";

type LoginSchema = z.infer<typeof loginSchema>;

const loginSchema = z
  .object({
    email: z.string().email("Email is invalid"),
    password: passwordSchema,
  })
  .required();

export const Login = () => {
  const { dispatch } = useNavigation();
  const validate = useFormikValidation(loginSchema);
  const utils = trpc.useContext();

  const { error, mutate, isLoading } = trpc.sessions.login.useMutation({
    onSuccess: ({ token }) => {
      tokenHandler.setToken(token);
      utils.sessions.get.invalidate();
    },
    onError: () => {
      // TODO: show popup
    },
  });

  const onSubmit = useCallback(
    (values: LoginSchema) => mutate(values),
    [mutate]
  );

  const navigateToSignUp = useCallback(
    () => dispatch(StackActions.replace("signUp")),
    [dispatch]
  );

  return (
    <Formik
      initialValues={{
        email: "mike@gmail.com",
        password: "1234",
      }}
      onSubmit={onSubmit}
      validate={validate}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="grow px-7">
          <View className="my-auto">
            <KeyboardAvoidingView
              behavior="padding"
              keyboardVerticalOffset={100}
              enabled
              className="grow"
            >
              <Typography weight="bold" className="text-3xl text-center">
                Overload
              </Typography>
              <Typography weight="bold" className="text-lg mb-10 text-center">
                Track your progress and see results.
              </Typography>
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
                placeholder="************"
                className="mb-8"
                secureTextEntry={true}
              />
              <SubmitButton
                onPress={Keyboard.dismiss}
                beforeIcon={<Icon name="log-in-outline" />}
                className="mb-5"
                loading={isLoading}
              >
                <Typography weight="bold">Log in</Typography>
              </SubmitButton>
              {error && (
                <Animated.View>
                  <Typography className="text-danger text-sm text-center">
                    {error.message}
                  </Typography>
                </Animated.View>
              )}
              <View className="flex flex-row justify-center mt-5">
                <Typography>Dont have an account yet?</Typography>
                <TextButton onPress={navigateToSignUp} className="ml-2">
                  Sign up
                </TextButton>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Formik>
  );
};
