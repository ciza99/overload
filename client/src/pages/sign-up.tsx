import { useCallback } from "react";
import {
  View,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { StackActions, useNavigation } from "@react-navigation/native";

import { trpc } from "@utils/trpc";
import { z } from "zod";
import {
  Typography,
  TextField,
  TextButton,
  Icon,
  Button,
} from "@components/common";
import { passwordSchema } from "@schemas";
import Animated, { StretchInY, StretchOutY } from "react-native-reanimated";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "mike",
      email: "mike@gmail.com",
      password: "1234",
      repeatPassword: "1234",
    },
  });

  const { error, mutate, isLoading } = trpc.users.create.useMutation({
    onSuccess: () => dispatch(StackActions.replace("login")),
  });

  const navigateToLogin = () => dispatch(StackActions.replace("login"));
  const onSubmit = (values: SignupSchema) => {
    Keyboard.dismiss();
    mutate(values);
  };

  return (
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
              control={control}
            />
            <TextField
              label="Email:"
              name="email"
              textContentType="emailAddress"
              placeholder="johndoe@gmail.com"
              className="mb-5"
              control={control}
            />
            <TextField
              label="Password:"
              name="password"
              textContentType="newPassword"
              placeholder="************"
              className="mb-5"
              secureTextEntry={true}
              control={control}
            />
            <TextField
              label="Repeat password:"
              name="repeatPassword"
              textContentType="newPassword"
              placeholder="************"
              className="mb-8"
              secureTextEntry={true}
              control={control}
            />
            <Button
              onPress={handleSubmit(onSubmit)}
              beforeIcon={<Icon name="create-outline" />}
              className="mb-2"
              loading={isLoading}
            >
              Sign up
            </Button>
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
  );
};
