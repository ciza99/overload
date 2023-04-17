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
        <View className="grow mx-3">
          <View className="my-auto">
            <KeyboardAvoidingView
              behavior="padding"
              keyboardVerticalOffset={100}
              enabled
              className="grow"
            >
              <View className="grow justify-end">
                <Typography
                  weight="bold"
                  className="text-3xl my-10 text-center"
                >
                  Overload
                </Typography>
                <Paper elevation={1} className="p-4">
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
                    className="mb-10"
                    secureTextEntry={true}
                  />
                  <SubmitButton
                    onPress={Keyboard.dismiss}
                    beforeIcon={<Icon name="log-in-outline" />}
                    className="mb-5"
                    loading={isLoading}
                  >
                    <Typography weight="bold">log in</Typography>
                  </SubmitButton>
                  {error && (
                    <Animated.View>
                      <Typography className="text-danger text-sm text-center">
                        {error.message}
                      </Typography>
                    </Animated.View>
                  )}
                </Paper>
                <View className="flex flex-row justify-center mt-5 mb-10">
                  <Typography>Dont have an account yet?</Typography>
                  <TextButton onPress={navigateToSignUp} className="ml-2">
                    Sign up
                  </TextButton>
                </View>
                <View className="grow" />
              </View>
            </KeyboardAvoidingView>
          </View>
          <View className="mb-7">
            <View className="flex flex-row items-center">
              <Divider className="grow w-0" />
              <Typography className="mx-3 text-base-200">
                Or log in with
              </Typography>
              <Divider className="grow w-0" />
            </View>
            <Button
              beforeIcon={<Icon name="ios-logo-google" />}
              variant="outlined"
              className="my-4"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Formik>
  );
};
