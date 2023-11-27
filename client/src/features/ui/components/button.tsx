import { ReactNode, useCallback, useMemo, useState } from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import clsx from "clsx";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { Spinner } from "@features/ui/components/spinner";
import { Typography } from "@features/ui/components/typography";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonProps = {
  children?: ReactNode;
  onPress?: PressableProps["onPress"];
  beforeIcon?: ReactNode;
  afterIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "secondary" | "outlined";
  className?: string;
  disabled?: boolean;
  loading?: boolean;
};

export const Button = ({
  onPress,
  beforeIcon,
  afterIcon,
  children,
  style,
  variant = "primary",
  className,
  disabled,
  loading,
}: ButtonProps) => {
  const [pressedDown, setPressedDown] = useState(false);

  const buttonStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withSpring(!loading && pressedDown ? 0.95 : 1, {
            stiffness: 250,
          }),
        },
      ],
    }),
    [loading, pressedDown]
  );

  const onPressIn = useCallback(() => setPressedDown(true), [setPressedDown]);
  const onPressOut = useCallback(() => setPressedDown(false), [setPressedDown]);

  const content = useMemo(
    () =>
      typeof children === "string" ? (
        <Typography weight="bold">{children}</Typography>
      ) : (
        children
      ),
    [children]
  );

  return (
    <AnimatedPressable
      disabled={loading || disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className={clsx(
        "mx-0 flex h-9 flex-row items-center justify-center rounded-lg py-1 px-4",
        {
          "bg-primary": variant === "primary",
          "bg-base-600": variant === "secondary",
          "border border-base-200 bg-transparent": variant === "outlined",
        },
        className
      )}
      style={[buttonStyle, style]}
    >
      {loading && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className="top-0 left-0 right-0 bottom-0 flex items-center justify-center"
        >
          <Spinner color="white" />
        </Animated.View>
      )}

      {!loading && (
        <Animated.View
          className="flex flex-row items-center"
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Typography>{beforeIcon}</Typography>
          <View
            className={clsx({
              "ml-2": !!beforeIcon,
              "mr-2": !!afterIcon,
            })}
          >
            {content}
          </View>
          <Typography>{afterIcon}</Typography>
        </Animated.View>
      )}
    </AnimatedPressable>
  );
};
