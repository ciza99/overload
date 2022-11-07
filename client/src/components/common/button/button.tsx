import { ReactNode, useCallback, useMemo, useState } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";
import { animated, useSpring, useTransition } from "@react-spring/native";

import { ThemeConfig } from "@components/theme/theme-types";
import { Box } from "@components/common/box/box";
import { Stack } from "@components/common/stack/stack";
import { SxProp } from "@components/theme/sx/sx-types";
import { useTheme } from "@components/theme";
import { Typography } from "@components/common/typography/typography";
import { Spinner } from "@components/common/spinner/spinner";

export type ButtonProps = {
  children?: ReactNode;
  color?: keyof ThemeConfig["palette"];
  onPress?: PressableProps["onPress"];
  beforeIcon?: ReactNode;
  afterIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  sx?: SxProp<ViewStyle>;
  variant?: "filled" | "outlined";
  disabled?: boolean;
  loading?: boolean;
};

const AnimatedStack = animated(Stack);
const AnimatedBox = animated(Box);

export const Button = ({
  onPress,
  beforeIcon,
  afterIcon,
  color = "primary",
  children,
  sx,
  style,
  variant = "filled",
  disabled,
  loading,
}: ButtonProps) => {
  const theme = useTheme();
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
        <Typography sx={theme.typography.button}>{children}</Typography>
      ) : (
        children
      ),
    [children, theme.typography.button]
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
        alignItems="center"
        justifyContent="center"
        sx={[
          {
            py: 2,
            px: 4,
            width: 1,
            mx: 0,
            backgroundColor: theme.palette[color],
            borderRadius: theme.shape.borderRadius,
          },
          variant === "outlined" && {
            backgroundColor: undefined,
            borderWidth: 2,
            borderColor: theme.palette.divider,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        style={[{ transform: [{ scale }] }, style]}
      >
        {bgTransition(
          ({ opacity }, notClickable) =>
            notClickable && (
              <AnimatedBox
                sx={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  position: "absolute",
                  backgroundColor: theme.palette.muted,
                }}
                style={{ opacity }}
              />
            )
        )}
        {transition(({ opacity, scale }, loading) => (
          <>
            {loading && (
              <AnimatedBox
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                style={{
                  transform: [{ scale }],
                  opacity,
                }}
              >
                <Spinner color="text" />
              </AnimatedBox>
            )}

            {!loading && (
              <AnimatedStack
                style={{
                  transform: [
                    {
                      scale: scale.to({ output: [0, 1] }),
                    },
                  ],
                  opacity: opacity.to({ output: [0, 1] }),
                }}
              >
                <Typography sx={{ ...theme.typography.button }}>
                  {beforeIcon}
                </Typography>
                <Box
                  sx={{
                    ml: beforeIcon ? 2 : 0,
                    mr: afterIcon ? 2 : 0,
                  }}
                >
                  {content}
                </Box>
                <Typography sx={{ ...theme.typography.button }}>
                  {afterIcon}
                </Typography>
              </AnimatedStack>
            )}
          </>
        ))}
      </AnimatedStack>
    </Pressable>
  );
};
