import { useCallback } from "react";
import { Keyboard } from "react-native";
import { animated, useTransition } from "@react-spring/native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";

import { trpc } from "utils/trpc";
import { useFormikValidation } from "hooks/use-formik-validation";
import {
  Typography,
  Paper,
  TextField,
  Stack,
  TextButton,
  TouchableNoFeedback,
  SubmitButton,
  ScrollBox,
  KeyboardAvoidingBox,
} from "components/common/index";

import { SignupSchema, signUpSchema } from "./sign-up-schema";

const AnimatedTypography = animated(Typography);

export const SignUp = () => {
  const { navigate } = useNavigation();
  const validate = useFormikValidation(signUpSchema);

  const { error, mutate, isLoading } = trpc.users.add.useMutation({
    onSuccess: () => {
      navigate("login");
    },
  });

  const onSubmit = useCallback(
    (values: SignupSchema) => mutate(values),
    [mutate]
  );

  const navigateToLogin = useCallback(() => navigate("login"), [navigate]);

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
        username: "mike",
        email: "mike@gmail.com",
        password: "test123",
        repeatPassword: "test123",
      }}
      onSubmit={onSubmit}
      validate={validate}
    >
      <KeyboardAvoidingBox
        behavior="padding"
        keyboardVerticalOffset={100}
        sx={{ flex: 1 }}
        enabled
      >
        <ScrollBox sx={{ flex: 1 }}>
          <TouchableNoFeedback
            onPress={Keyboard.dismiss}
            sx={{ mx: 3, flex: 1, justifyContent: "flex-end" }}
          >
            <Typography variant="title1Bold" sx={{ my: 10 }}>
              Overload
            </Typography>
            <Paper elevation={1} sx={{ p: 4 }}>
              <Typography variant="title2" sx={{ mb: 10 }}>
                Sign up
              </Typography>
              <TextField
                label="Username:"
                name="username"
                textContentType="username"
                placeholder="johndoe@gmail.com"
                sx={{ mb: 5 }}
              />
              <TextField
                label="Email:"
                name="email"
                textContentType="emailAddress"
                placeholder="johndoe@gmail.com"
                sx={{ mb: 5 }}
                onLayout={(e) => e.nativeEvent.layout.x}
              />
              <TextField
                label="Password:"
                name="password"
                textContentType="newPassword"
                placeholder="************"
                sx={{ mb: 5 }}
                secureTextEntry={true}
              />
              <TextField
                label="Repeat password:"
                name="repeatPassword"
                textContentType="newPassword"
                placeholder="************"
                sx={{ mb: 10 }}
                secureTextEntry={true}
              />
              <SubmitButton
                onPress={Keyboard.dismiss}
                beforeIcon={<Ionicons size={24} name="create-outline" />}
                sx={(theme) => ({
                  mb: 5,
                  height: theme.spacing(12),
                })}
                loading={isLoading}
              >
                sign up
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
            <Stack direction="row" justifyContent="center" sx={{ mt: 5 }}>
              <Typography>Already have an account?</Typography>
              <TextButton
                onPress={navigateToLogin}
                sx={(theme) => ({ ml: 2, color: theme.palette.primary })}
              >
                Log in
              </TextButton>
            </Stack>
          </TouchableNoFeedback>
        </ScrollBox>
      </KeyboardAvoidingBox>
    </Formik>
  );
};
