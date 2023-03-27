import { ReactNode, useCallback } from "react";
import { animated, useTransition } from "@react-spring/native";
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
};

const AnimatedTypography = animated(Typography);

export const TextField = ({
  name,
  label,
  style,
  className,
  inputStyle,
  inputClassName,
  containerStyle,
  containerClassName,
  ...rest
}: TextFieldProps) => {
  const [field, meta, helpers] = useField<string>(name);
  const transitions = useTransition(meta.touched && meta.error, {
    from: {
      opacity: 0,
      scaleY: 0,
      height: 0,
      marginTop: 0,
    },
    enter: {
      opacity: 1,
      scaleY: 1,
      height: 15,
      marginTop: 4,
    },
    leave: {
      opacity: 0,
      scaleY: 0,
      height: 0,
      marginTop: 0,
    },
  });

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
          "px-2 py-1 bg-transparent bg-base-900 border border-base-500 w-full flex rounded",
          containerClassName
        )}
        style={containerStyle}
      >
        <TextInput
          selectionColor={colors.primary}
          keyboardAppearance="dark"
          placeholderTextColor={colors.base[300]}
          onChangeText={handleChange}
          onBlur={handleBlur}
          value={field.value}
          className={clsx("text-white h-8", inputClassName)}
          style={inputStyle}
          {...rest}
        />
      </View>
      {transitions(
        ({ opacity, scaleY, height, marginTop }, error) =>
          error && (
            <AnimatedTypography
              className="text-danger text-xs"
              style={{ transform: [{ scaleY }], opacity, height, marginTop }}
            >
              {error}
            </AnimatedTypography>
          )
      )}
    </View>
  );
};
