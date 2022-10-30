import { ReactNode, useCallback, useMemo, useState } from "react";
import { View, Pressable, PressableProps, ViewStyle } from "react-native";
import { animated, useSpring, useTransition } from "@react-spring/native";
import cx from "clsx";

import { Stack } from "@components/common/stack/stack";
import { Typography } from "@components/common/typography/typography";
import { Spinner } from "@components/common/spinner/spinner";

export type ButtonProps = {
  children?: ReactNode;
  onPress?: PressableProps["onPress"];
  beforeIcon?: ReactNode;
  afterIcon?: ReactNode;
  style?: ViewStyle;
  variant?: "filled" | "outlined";
  disabled?: boolean;
  loading?: boolean;
  tw?: string;
};

const AnimatedView = animated(View);
const AnimatedStack = animated(Stack);

export const Button = ({
  onPress,
  beforeIcon,
  afterIcon,
  children,
  style,
  variant = "filled",
  disabled,
  loading,
  tw,
}: ButtonProps) => {
  const [pressedDown, setPressedDown] = useState(false);

  const { scale } = useSpring({
    scale: !loading && pressedDown ? 0.95 : 1,
    loop: true,
  });

  const transition = useTransition(!!loading, {
    from: {
      opacity: 0,
      scale: 0,
    },
    enter: (loading) => async (next) => {
      await new Promise((resolve) => setTimeout(resolve, loading ? 0 : 250));

      await next({
        opacity: 1,
        scale: 1,
      });
    },
    leave: (loading) => async (next) => {
      await new Promise((resolve) => setTimeout(resolve, loading ? 250 : 0));

      await next({
        opacity: 0,
        scale: 0,
      });
    },
    initial: {
      opacity: 1,
      scale: 1,
    },
  });

  const bgTransition = useTransition(loading || disabled, {
    from: {
      opacity: 0,
    },
    enter: (unclickable) => async (next) => {
      await new Promise((resolve) =>
        setTimeout(resolve, unclickable ? 0 : 250)
      );

      return next({ opacity: 0.5 });
    },
    leave: (unclickable) => async (next) => {
      await new Promise((resolve) =>
        setTimeout(resolve, unclickable ? 250 : 0)
      );

      return next({ opacity: 0 });
    },
  });

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
    <Pressable
      disabled={loading || disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <AnimatedStack
        direction="row"
        items="center"
        justify="center"
        tw={cx(tw, "py-2 px-4 w-full mx-0 rounded", {
          "bg-primary": variant === "filled",
          "bg-transparent border border-divider": variant === "outlined",
        })}
        style={[{ transform: [{ scale }] }, style]}
      >
        {bgTransition(
          ({ opacity }, notClickable) =>
            notClickable && (
              <AnimatedView
                tw="top-0 left-0 right-0 bottom-0 absolute bg-muted"
                style={{ opacity }}
              />
            )
        )}
        {transition(({ opacity, scale }, loading) => (
          <>
            {loading && (
              <AnimatedView
                tw="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
                style={{
                  transform: [{ scale }],
                  opacity,
                }}
              >
                <Spinner />
              </AnimatedView>
            )}

            {!loading && (
              <AnimatedStack
                style={{
                  transform: [{ scale: scale.to({ output: [0, 1] }) }],
                  opacity: opacity.to({ output: [0, 1] }),
                }}
              >
                <Typography>{beforeIcon}</Typography>
                <View
                  tw={cx({
                    "ml-2": beforeIcon,
                    "mr-2": afterIcon,
                  })}
                >
                  {content}
                </View>
                <Typography>{afterIcon}</Typography>
              </AnimatedStack>
            )}
          </>
        ))}
      </AnimatedStack>
    </Pressable>
  );
};
