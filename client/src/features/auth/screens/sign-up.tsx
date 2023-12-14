import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import Animated, { StretchInY, StretchOutY } from "react-native-reanimated";
import { z } from "zod";

import { trpc } from "@features/api/trpc";
import {
  Button,
  Icon,
  TextButton,
  TextField,
  Typography,
} from "@features/ui/components";
import { colors } from "@features/ui/theme";
import { passwordSchema } from "@features/auth/schema";

import OverloadLogo from "../../../../assets/overload-logo.svg";

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
          <View className="my-auto px-7">
            <View className="mb-4 flex flex-row items-end justify-center">
              <OverloadLogo color={colors.primary} height={40} width={40} />
              <Typography weight="bold" className="ml-4 text-center text-3xl">
                Overload
              </Typography>
            </View>
            <Typography weight="bold" className="mb-10 text-center text-lg">
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
                <Typography className="text-center text-sm text-danger">
                  {error.message}
                </Typography>
              </Animated.View>
            )}
            <View className="flex flex-row justify-center pt-8">
              <Typography className="mr-2">Already have an account?</Typography>
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
