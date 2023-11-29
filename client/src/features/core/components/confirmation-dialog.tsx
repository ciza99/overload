import { ReactNode } from "react";
import { View } from "react-native";
import clsx from "clsx";

import { Button, ButtonProps, NativeNode } from "@features/ui/components";

import { DialogProps } from "../hooks/use-store";

export const ConfirmationDialog = ({
  close,
  onConfirm,
  onCancel,
  content = "Are you sure?",
  confirmText = "Confirm",
  confirmButtonProps,
  cancelText = "Cancel",
  cancelButtonProps,
}: DialogProps<{
  content: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  confirmButtonProps?: Omit<ButtonProps, "children">;
  cancelText?: string;
  cancelButtonProps?: Omit<ButtonProps, "children">;
}>) => {
  return (
    <View className="w-full">
      <NativeNode>{content}</NativeNode>
      <View className="flex flex-row gap-x-2">
        <Button
          onPress={() => {
            onConfirm?.();
            close();
          }}
          {...confirmButtonProps}
          className={clsx("mt-4 flex-1", confirmButtonProps?.className)}
        >
          {confirmText}
        </Button>
        <Button
          variant="outlined"
          onPress={() => {
            onCancel?.();
            close();
          }}
          {...cancelButtonProps}
          className={clsx("mt-4 flex-1", cancelButtonProps?.className)}
        >
          {cancelText}
        </Button>
      </View>
    </View>
  );
};
