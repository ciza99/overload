import { useCallback } from "react";
import {
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { animated, useTransition } from "@react-spring/native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { z } from "zod";

import {
  Typography,
  Paper,
  TextField,
  Button,
  TextButton,
  SubmitButton,
  Divider,
} from "@components/common";
import { tokenHandler } from "@utils/token-handler";
import { trpc } from "@utils/trpc";
import { useFormikValidation } from "@hooks/use-formik-validation";
import { passwordSchema } from "@schemas";

type LoginSchema = z.infer<typeof loginSchema>;

const loginSchema = z
  .object({
    email: z.string().email("Email is invalid"),
    password: passwordSchema,
  })
  .required();

const AnimatedTypography = animated(Typography);

export const Login = () => {
  const { navigate } = useNavigation();
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

  const navigateToSignUp = useCallback(() => navigate("signUp"), [navigate]);

  const transitions = useTransition(error, {
    from: {
      scaleY: 0,
      height: 0,
    },
    enter: {
      scaleY: 1,
      height: 20,
    },
    leave: {
      scaleY: 0,
      height: 0,
    },
  });

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
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={100}
            enabled
            className="grow"
          >
            <View className="grow justify-end">
              <View>
                <Typography weight="bold" className="text-3xl my-10">
                  Overload
                </Typography>
              </View>
              <Paper elevation={1} className="p-4">
                <Typography weight="bold" className="text-2xl mb-10">
                  Log In
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
                  className="mb-10"
                  secureTextEntry={true}
                />
                <SubmitButton
                  onPress={Keyboard.dismiss}
                  beforeIcon={<Ionicons size={24} name="log-in-outline" />}
                  className="mb-5"
                  loading={isLoading}
                >
                  <Typography weight="bold">log in</Typography>
                </SubmitButton>
                {transitions(
                  ({ scaleY, height }, error) =>
                    error && (
                      <AnimatedTypography
                        className="text-danger text-sm text-center"
                        style={{ height, transform: [{ scaleY }] }}
                      >
                        {error.message}
                      </AnimatedTypography>
                    )
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
          <View className="mb-7">
            <View className="flex flex-row items-center">
              <Divider className="grow w-0" />
              <Typography className="mx-3">Or log in with</Typography>
              <Divider className="grow w-0" />
            </View>
            <Button
              beforeIcon={<Ionicons name="ios-logo-google" size={24} />}
              variant="outlined"
              className="my-4"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Formik>
  );
};
