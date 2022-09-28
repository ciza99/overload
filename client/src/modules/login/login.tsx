import { useCallback } from "react";
import { Keyboard } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { useHeaderHeight } from "@react-navigation/elements";
import { animated, useTransition } from "@react-spring/native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  TextButton,
  TouchableNoFeedback,
  SubmitButton,
  KeyboardAvoidingBox,
} from "components/index";
import { Divider } from "components/divider/divider";
import { useAuth } from "context/auth/auth-context";
import { tokenHandler } from "context/auth/token-handler";

import { loginSchema } from "./login-schema";
import { useNavigation } from "@react-navigation/native";
import { trpc } from "trpc/index";

export type LoginFormValues = {
  email: string;
  password: string;
};

const initialValues: LoginFormValues = {
  email: "mike@gmail.com",
  password: "test123",
};

const AnimatedTypography = animated(Typography);

export const Login = () => {
  const { reauthenticate } = useAuth();
  const { navigate } = useNavigation();

  const { error, mutate, isLoading } = trpc.sessions.login.useMutation({
    onSuccess: ({ token }) => {
      tokenHandler.setToken(token);
      reauthenticate();
    },
    onError: () => {
      // TODO: show popup
    },
  });

  const onSubmit = useCallback(
    (values: LoginFormValues) => mutate(values),
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
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={loginSchema}
    >
      <TouchableNoFeedback onPress={Keyboard.dismiss} sx={{ mx: 3, flex: 1 }}>
        <KeyboardAvoidingBox
          behavior="padding"
          keyboardVerticalOffset={100}
          enabled
          sx={{ flex: 1 }}
        >
          <Box sx={{ flex: 1, justifyContent: "flex-end" }}>
            <Box>
              <Typography variant="title1Bold" sx={{ my: 10 }}>
                Overload
              </Typography>
            </Box>
            <Paper elevation={1} sx={{ p: 4 }}>
              <Typography variant="title2" sx={{ mb: 10 }}>
                Log In
              </Typography>
              <TextField
                label="Email:"
                name="email"
                textContentType="emailAddress"
                placeholder="johndoe@gmail.com"
                sx={{ mb: 5 }}
              />
              <TextField
                label="Password:"
                name="password"
                placeholder="************"
                sx={{ mb: 10 }}
                secureTextEntry={true}
              />
              <SubmitButton
                onPress={Keyboard.dismiss}
                beforeIcon={<Ionicons size={24} name="log-in-outline" />}
                sx={(theme) => ({
                  mb: 5,
                  height: theme.spacing(12),
                })}
                loading={isLoading}
              >
                log in
              </SubmitButton>
              {transitions(
                ({ scaleY, height }, error) =>
                  error && (
                    <AnimatedTypography
                      color="danger"
                      variant="body2"
                      sx={{ textAlign: "center" }}
                      style={{ height, transform: [{ scaleY }] }}
                    >
                      {error.message}
                    </AnimatedTypography>
                  )
              )}
            </Paper>
            <Stack
              direction="row"
              justifyContent="center"
              sx={{ mt: 5, mb: 10 }}
            >
              <Typography>Dont have an account yet?</Typography>
              <TextButton
                onPress={navigateToSignUp}
                sx={(theme) => ({ ml: 2, color: theme.palette.primary })}
              >
                Sign up
              </TextButton>
            </Stack>
            <Box sx={{ flex: 1 }} />
          </Box>
        </KeyboardAvoidingBox>
        <Box sx={{ mb: 7 }}>
          <Stack direction="row">
            <Divider sx={{ flex: 1 }} />
            <Typography sx={{ mx: 3 }}>Or log in with</Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>
          <Button
            beforeIcon={<Ionicons name="ios-logo-google" size={24} />}
            variant="outlined"
            sx={(theme) => ({ m: 4, height: theme.spacing(12) })}
          />
        </Box>
      </TouchableNoFeedback>
    </Formik>
  );
};
