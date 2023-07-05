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
  interpolateColor,
  Layout,
  StretchInY,
  StretchOutY,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
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
  precision?: number;
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
  keyboardType,
  precision = 2,
  control,
  ...rest
}: TextFieldProps<TFormValues>) => {
  const focused = useSharedValue(false);
  const colorTransition = useDerivedValue(() =>
    withTiming(focused.value ? 1 : 0, { duration: 150 })
  );
  const {
    field,
    fieldState: { isTouched, error },
  } = useController({ name, control });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        colorTransition.value,
        [0, 1],
        ["rgba(0,0,0,0)", colors.primary]
      ),
    };
  }, []);

  const onChange = (value: string) => {
    if (
      keyboardType === "numbers-and-punctuation" ||
      keyboardType === "numeric" ||
      keyboardType === "number-pad" ||
      keyboardType === "decimal-pad"
    ) {
      console.log({ value });
      const digitsAndPunctuation = value.replace(/[^0-9.,]/g, "");
      console.log({ digitsAndPunctuation });
      //TODO: clean the number from multiple dots
      const dotIndex = digitsAndPunctuation.search(/[.,]/g);
      console.log({ dotIndex });
      if (dotIndex === -1) return field.onChange(digitsAndPunctuation);

      const cleanNumber =
        digitsAndPunctuation.slice(0, dotIndex + 1) +
        digitsAndPunctuation
          .slice(dotIndex + 1)
          .replace(/[,.]/g, "")
          .slice(0, precision);
      return field.onChange(cleanNumber);
    }

    field.onChange(value);
  };

  return (
    <View className={className} style={style}>
      {label && (
        <View className="mb-1">
          <NativeNode textClassName="text-base-100">{label}</NativeNode>
        </View>
      )}
      <Animated.View
        className={clsx(
          "px-2 py-1 border bg-transparent bg-base-600 w-full flex flex-row items-center rounded-lg",
          containerClassName
        )}
        style={[animatedStyle, containerStyle]}
      >
        <TextInput
          selectionColor={colors.primary}
          keyboardAppearance="dark"
          placeholderTextColor={colors.base[200]}
          onChangeText={onChange}
          value={field.value}
          className={clsx("text-white h-7 grow", inputClassName)}
          style={inputStyle}
          keyboardType={keyboardType}
          onBlur={() => {
            focused.value = false;
            field.onBlur();
          }}
          onFocus={(e) => {
            focused.value = true;
            rest.onFocus?.(e);
          }}
          {...rest}
        />
        {rightContent}
      </Animated.View>

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
