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

import {
  Typography,
  SubmitButton,
  Paper,
  TextField,
  Button,
  Stack,
  TextButton,
  Divider,
} from "@components/common";
import { tokenHandler } from "@utils/token-handler";
import { trpc } from "@utils/trpc";
import { useFormikValidation } from "@hooks/use-formik-validation";

import { LoginSchema, loginSchema } from "./login-schema";

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
        password: "test123",
      }}
      onSubmit={onSubmit}
      validate={validate}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View tw="px-2 grow">
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={100}
            enabled
            tw="grow"
          >
            <View tw="grow justify-end">
              <View>
                <Typography variant="title1" tw="my-5">
                  Overload
                </Typography>
              </View>
              <Paper elevation={1} tw="p-2">
                <Typography variant="title2" tw="mb-5">
                  Log In
                </Typography>
                <TextField
                  label="Email:"
                  name="email"
                  textContentType="emailAddress"
                  placeholder="johndoe@gmail.com"
                  tw="mb-2"
                />
                <TextField
                  label="Password:"
                  name="password"
                  placeholder="************"
                  tw="mb-5"
                  secureTextEntry={true}
                />
                <SubmitButton
                  onPress={Keyboard.dismiss}
                  beforeIcon={<Ionicons size={24} name="log-in-outline" />}
                  tw="mb-2 h-12"
                  loading={isLoading}
                >
                  log in
                </SubmitButton>
                {transitions(
                  ({ scaleY, height }, error) =>
                    error && (
                      <AnimatedTypography
                        tw="color-danger text-center"
                        variant="body"
                        style={{ height, transform: [{ scaleY }] }}
                      >
                        {error.message}
                      </AnimatedTypography>
                    )
                )}
              </Paper>
              <Stack direction="row" justify="center" tw="mt-2 mb-5">
                <Typography>Dont have an account yet?</Typography>
                <TextButton onPress={navigateToSignUp} tw="ml-4">
                  Sign up
                </TextButton>
              </Stack>
              <View tw="grow" />
            </View>
          </KeyboardAvoidingView>
          <View tw="mb-3">
            <Stack direction="row">
              <Divider tw="grow" />
              <Typography tw="mx-4">Or log in with</Typography>
              <Divider tw="grow" />
            </Stack>
            <Button
              beforeIcon={<Ionicons name="ios-logo-google" size={24} />}
              variant="outlined"
              tw="m-2 h-12"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Formik>
  );
};
