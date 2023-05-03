import { ReactNode, useCallback } from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { useField } from "formik";
import clsx from "clsx";

import { NativeNode } from "@components/common/native-node";
import { Typography } from "@components/common/typography";
import { colors } from "@constants/theme";
import Animated, {
  BaseAnimationBuilder,
  EntryAnimationsValues,
  EntryExitAnimationFunction,
  FadeIn,
  FadeOut,
  Keyframe,
  Layout,
  LayoutAnimation,
  LayoutAnimationFunction,
  StretchInY,
  StretchOutY,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type TextFieldProps = Omit<
  TextInputProps,
  "value" | "onChangeText" | "onChange" | "onBlur" | "style"
> & {
  name: string;
  label?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  inputClassName?: string;
  inputStyle?: StyleProp<TextStyle>;
  containerClassName?: string;
  containerStyle?: StyleProp<ViewStyle>;
  rightContent?: ReactNode;
};

export const TextField = ({
  name,
  label,
  style,
  className,
  inputStyle,
  inputClassName,
  containerStyle,
  containerClassName,
  rightContent,
  ...rest
}: TextFieldProps) => {
  const [field, meta, helpers] = useField<string>(name);

  const transition = useDerivedValue(() => {
    return meta.touched && meta.error
      ? withSpring(1, { damping: 20 })
      : withTiming(0);
  }, [meta.touched, meta.error]);

  const errorStyle = useAnimatedStyle(
    () => ({
      height: transition.value * 15,
      opacity: transition.value,
      marginTop: transition.value * 4,
      transform: [{ scaleY: transition.value }],
    }),
    []
  );

  const handleChange = useCallback(
    (text: string) => helpers.setValue(text),
    [helpers]
  );

  const handleBlur = useCallback(() => helpers.setTouched(true), [helpers]);

  return (
    <View className={className} style={style}>
      {label && (
        <View className="mb-1">
          <NativeNode textClassName="text-base-100">{label}</NativeNode>
        </View>
      )}
      <View
        className={clsx(
          "px-2 py-1 bg-transparent bg-base-600 w-full flex flex-row items-center rounded-lg",
          containerClassName
        )}
        style={containerStyle}
      >
        <TextInput
          selectionColor={colors.primary}
          keyboardAppearance="dark"
          placeholderTextColor={colors.base[200]}
          onChangeText={handleChange}
          onBlur={handleBlur}
          value={field.value}
          className={clsx("text-white h-7 grow", inputClassName)}
          style={inputStyle}
          {...rest}
        />
        {rightContent}
      </View>

      {meta.touched && meta.error && (
        <Animated.View
          entering={StretchInY}
          exiting={StretchOutY}
          layout={Layout.springify()}
          className="mt-1"
        >
          <Typography className="text-danger text-xs">{meta.error}</Typography>
        </Animated.View>
      )}
    </View>
  );
};
