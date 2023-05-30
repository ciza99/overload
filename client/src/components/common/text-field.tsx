import { ReactNode } from "react";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import clsx from "clsx";

import { NativeNode } from "@components/common/native-node";
import { Typography } from "@components/common/typography";
import { colors } from "@constants/theme";
import Animated, {
  Layout,
  StretchInY,
  StretchOutY,
} from "react-native-reanimated";
import { Control, FieldValues, Path, useController } from "react-hook-form";

type TextFieldProps<TFormValues extends FieldValues> = Omit<
  TextInputProps,
  "value" | "onChangeText" | "onChange" | "onBlur" | "style"
> & {
  name: Path<TFormValues>;
  label?: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  inputClassName?: string;
  inputStyle?: StyleProp<TextStyle>;
  containerClassName?: string;
  containerStyle?: StyleProp<ViewStyle>;
  rightContent?: ReactNode;
  control: Control<TFormValues>;
};

export const TextField = <TFormValues extends FieldValues>({
  name,
  label,
  style,
  className,
  inputStyle,
  inputClassName,
  containerStyle,
  containerClassName,
  rightContent,
  control,
  ...rest
}: TextFieldProps<TFormValues>) => {
  const {
    field,
    fieldState: { isTouched, error },
  } = useController({ name, control });

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
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={field.value}
          className={clsx("text-white h-7 grow", inputClassName)}
          style={inputStyle}
          {...rest}
        />
        {rightContent}
      </View>

      {isTouched && error && (
        <Animated.View
          entering={StretchInY}
          exiting={StretchOutY}
          layout={Layout.springify()}
          className="mt-1"
        >
          <Typography className="text-danger text-xs">
            {error.message}
          </Typography>
        </Animated.View>
      )}
    </View>
  );
};
