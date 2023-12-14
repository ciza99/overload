import { useCallback } from "react";
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
import { tokenHandler } from "@features/auth/lib/token-handler";
import { passwordSchema } from "@features/auth/schema";

import OverloadLogo from "../../../../assets/overload-logo.svg";

type LoginSchema = z.infer<typeof loginSchema>;

const loginSchema = z
  .object({
    email: z.string().email("Email is invalid"),
    password: passwordSchema,
  })
  .required();

export const Login = () => {
  const { dispatch } = useNavigation();
  const utils = trpc.useUtils();
  const { handleSubmit, control } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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
    (values: LoginSchema) => {
      Keyboard.dismiss();
      mutate(values);
    },
    [mutate]
  );

  const navigateToSignUp = useCallback(
    () => dispatch(StackActions.replace("signUp")),
    [dispatch]
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="grow px-7">
        <View className="my-auto">
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={100}
            enabled
            className="grow"
          >
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
              placeholder="************"
              className="mb-8"
              secureTextEntry={true}
              control={control}
            />
            <Button
              onPress={handleSubmit(onSubmit)}
              beforeIcon={<Icon name="log-in-outline" />}
              className="mb-5"
              loading={isLoading}
            >
              <Typography weight="bold">Log in</Typography>
            </Button>
            {error && (
              <Animated.View entering={StretchInY} exiting={StretchOutY}>
                <Typography className="text-center text-sm text-danger">
                  {error.message}
                </Typography>
              </Animated.View>
            )}
            <View className="mt-5 flex flex-row justify-center">
              <Typography>Dont have an account yet?</Typography>
              <TextButton onPress={navigateToSignUp} className="ml-2">
                Sign up
              </TextButton>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
