import { ReactNode, useCallback } from "react";
import { animated, useTransition } from "@react-spring/native";
import {
  View,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { useField } from "formik";
import { useColorScheme } from "nativewind";
import cx from "clsx";

import { colors } from "@constants/theme";
import { NativeNode } from "@components/common/native-node/native-node";
import { Typography } from "@components/common/typography/typography";

type TextFieldProps = Omit<
  TextInputProps,
  "value" | "onChangeText" | "onChange" | "onBlur" | "style"
> & {
  name: string;
  label?: ReactNode;
  tw?: string;
  style?: ViewStyle;
  inputTw?: string;
  inputStyle?: TextStyle;
  containerTw?: string;
  containerStyle?: ViewStyle;
};

const AnimatedTypography = animated(Typography);

export const TextField = ({
  name,
  label,
  style,
  tw,
  inputStyle,
  inputTw,
  containerTw,
  containerStyle,
  ...rest
}: TextFieldProps) => {
  const { colorScheme } = useColorScheme();
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
      height: 20,
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
    <View tw={tw} style={style}>
      {label && (
        <View>
          <NativeNode>{label}</NativeNode>
        </View>
      )}
      <View
        tw={cx(containerTw, "p-2 bg-background w-full flex")}
        style={containerStyle}
      >
        <TextInput
          selectionColor={colors.primary as string}
          keyboardAppearance={colorScheme}
          placeholderTextColor={colors.muted as string}
          onChangeText={handleChange}
          onBlur={handleBlur}
          value={field.value}
          tw={cx(inputTw, "text-text h-8")}
          style={inputStyle}
          {...rest}
        />
      </View>
      {transitions(
        ({ opacity, scaleY, height, marginTop }, error) =>
          error && (
            <AnimatedTypography
              tw="text-danger"
              style={{ transform: [{ scaleY }], opacity, height, marginTop }}
            >
              {error}
            </AnimatedTypography>
          )
      )}
    </View>
  );
};
