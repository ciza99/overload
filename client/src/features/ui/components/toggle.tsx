import { ReactNode } from "react";
import { Switch, View } from "react-native";
import clsx from "clsx";
import { Control, FieldValues, Path, useController } from "react-hook-form";

import { colors } from "../theme";
import { NativeNode } from "./native-node";

type ToggleProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  label?: ReactNode;
  className?: string;
};

export const Toggle = <TFormValues extends FieldValues>({
  control,
  name,
  label,
  className,
}: ToggleProps<TFormValues>) => {
  const { field } = useController({ name, control });

  return (
    <View className={clsx("flex flex-row items-center", className)}>
      {label && (
        <NativeNode textClassName="text-base-200 mr-4">{label}</NativeNode>
      )}
      <Switch
        onValueChange={field.onChange}
        value={field.value}
        trackColor={{ true: colors.primary, false: colors.base[100] }}
      />
    </View>
  );
};
