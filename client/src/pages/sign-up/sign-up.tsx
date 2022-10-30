import { useCallback } from "react";
import {
  Keyboard,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { animated, useTransition } from "@react-spring/native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";

import { trpc } from "@utils/trpc";
import { useFormikValidation } from "@hooks/use-formik-validation";
import {
  Typography,
  Paper,
  TextField,
  Stack,
  TextButton,
  SubmitButton,
} from "@components/common";

import { SignupSchema, signUpSchema } from "./sign-up-schema";

const AnimatedTypography = animated(Typography);

export const SignUp = () => {
  const { navigate } = useNavigation();
  const validate = useFormikValidation(signUpSchema);

  const { error, mutate, isLoading } = trpc.users.add.useMutation({
    onSuccess: () => navigate("login"),
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
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={100}
        tw="grow"
        enabled
      >
        <ScrollView tw="grow">
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            tw="mx-1 grow justify-end"
          >
            <View>
              <Typography variant="title1" weight="bold">
                Overload
              </Typography>
              <Paper elevation={1} tw="p-2">
                <Typography variant="title2" tw="mb-5">
                  Sign up
                </Typography>
                <TextField
                  label="Username:"
                  name="username"
                  textContentType="username"
                  placeholder="johndoe@gmail.com"
                  tw="mb-2"
                />
                <TextField
                  label="Password:"
                  name="password"
                  textContentType="newPassword"
                  placeholder="************"
                />
                <TextField
                  label="Email:"
                  name="email"
                  textContentType="emailAddress"
                  placeholder="johndoe@gmail.com"
                  tw="mb-2"
                  onLayout={(e) => e.nativeEvent.layout.x}
                />
                <TextField
                  label="Password:"
                  name="password"
                  textContentType="newPassword"
                  placeholder="************"
                  secureTextEntry={true}
                  tw="mb-2"
                />
                <TextField
                  label="Repeat password:"
                  name="repeatPassword"
                  textContentType="newPassword"
                  placeholder="************"
                  tw="mb-5"
                  secureTextEntry={true}
                />
                <SubmitButton
                  onPress={Keyboard.dismiss}
                  beforeIcon={<Ionicons size={24} name="create-outline" />}
                  tw="mb-2 h-6"
                  loading={isLoading}
                >
                  sign up
                </SubmitButton>
                {transitions(
                  ({ scaleY, height }, error) =>
                    error && (
                      <AnimatedTypography
                        tw="text-danger text-center"
                        style={{ height, transform: [{ scaleY }] }}
                      >
                        {error.message}
                      </AnimatedTypography>
                    )
                )}
              </Paper>
              <Stack direction="row" justify="center" tw="mt-2">
                <Typography>Already have an account?</Typography>
                <TextButton onPress={navigateToLogin} tw="ml-1 text-primary">
                  Log in
                </TextButton>
              </Stack>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </Formik>
  );
};
