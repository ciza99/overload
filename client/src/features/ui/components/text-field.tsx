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
import { Control, FieldValues, Path, useController } from "react-hook-form";
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

import { NativeNode } from "@features/ui/components/native-node";
import { Typography } from "@features/ui/components/typography";
import { colors } from "@features/ui/theme";

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
  borderColor?: string;
  activeBorderColor?: string;
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
  editable,
  borderColor = "rgba(0,0,0,0)",
  activeBorderColor = colors.base[300],
  ...rest
}: TextFieldProps<TFormValues>) => {
  const focused = useSharedValue(false);
  const colorTransition = useDerivedValue(() =>
    withTiming(focused.value ? 1 : 0, { duration: 150 })
  );
  const {
    field,
    formState: { submitCount },
    fieldState: { isTouched, error },
  } = useController({ name, control });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        colorTransition.value,
        [0, 1],
        [borderColor, activeBorderColor]
      ),
    };
  }, [borderColor, activeBorderColor]);

  const onChange = (value: string) => {
    if (
      keyboardType === "numbers-and-punctuation" ||
      keyboardType === "numeric" ||
      keyboardType === "number-pad" ||
      keyboardType === "decimal-pad"
    ) {
      const digitsAndPunctuation = value.replace(/[^0-9.,]/g, "");
      const dotIndex = digitsAndPunctuation.search(/[.,]/g);
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

  const showErrors = isTouched || submitCount > 0;

  return (
    <View className={className} style={style}>
      {label && (
        <View className="mb-1">
          <NativeNode textClassName="text-base-100">{label}</NativeNode>
        </View>
      )}
      <Animated.View
        className={clsx(
          "flex w-full flex-row items-center rounded-lg border bg-transparent bg-base-600 px-2 py-1",
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
          className={clsx("h-6 grow text-white", inputClassName)}
          style={inputStyle}
          keyboardType={keyboardType}
          editable={editable}
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

      {showErrors && error && (
        <Animated.View
          entering={StretchInY}
          exiting={StretchOutY}
          layout={Layout.springify()}
          className="mt-1"
        >
          <Typography className="text-xs text-danger">
            {error.message}
          </Typography>
        </Animated.View>
      )}
    </View>
  );
};
