import { useCallback } from "react";
import {
  View,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { animated, useTransition } from "@react-spring/native";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import { z } from "zod";

import { trpc } from "@utils/trpc";
import { useFormikValidation } from "@hooks/use-formik-validation";
import {
  Typography,
  Paper,
  TextField,
  TextButton,
  SubmitButton,
} from "@components/common";
import { passwordSchema } from "@schemas";

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
        className="grow"
        enabled
      >
        <ScrollView className="grow">
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            className="grow flex flex-end"
          >
            <View className="grow mx-3">
              <Typography weight="bold" className="text-3xl my-10">
                Overload
              </Typography>
              <Paper elevation={1} className="p-4">
                <Typography weight="bold" className="text-2xl mb-10">
                  Sign up
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
                  onLayout={(e) => e.nativeEvent.layout.x}
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
                  className="mb-10"
                  secureTextEntry={true}
                />
                <SubmitButton
                  onPress={Keyboard.dismiss}
                  beforeIcon={<Ionicons size={24} name="create-outline" />}
                  className="mb-5 h-12"
                  loading={isLoading}
                >
                  sign up
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
              <View className="flex flex-row justify-center mt-5">
                <Typography>Already have an account?</Typography>
                <TextButton
                  onPress={navigateToLogin}
                  className="ml-2 text-primary"
                >
                  Log in
                </TextButton>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </Formik>
  );
};
