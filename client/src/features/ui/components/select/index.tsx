import { createContext, FC, ReactNode, useContext, useRef } from "react";
import { Pressable, View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import clsx from "clsx";

import { BottomSheetModal, BottomSheetModalType } from "../bottom-sheet-modal";
import { Icon } from "../icon";
import { Typography } from "../typography";

type Value = string | string[];

export const SelectCtx = createContext<{
  multiple?: boolean;
  value: Value;
  handleChange: (value: string) => void;
}>(undefined as never);

const defaultRenderValue = (value: Value) => (
  <Typography>{Array.isArray(value) ? value.join(", ") : value}</Typography>
);

export const SelectRoot: FC<{
  value: Value;
  onChange?: (value: Value) => void;
  renderValue?: (value: Value) => React.ReactNode;
  children: ReactNode;
  multiple?: boolean;
  className?: string;
}> = ({
  value,
  onChange,
  renderValue = defaultRenderValue,
  children,
  multiple,
  className,
}) => {
  const ref = useRef<BottomSheetModalType>(null);
  const handleChange = (value: string) => {
    onChange?.(value);

    if (multiple) return;
    ref.current?.close();
  };

  return (
    <>
      <Pressable
        onPress={() => ref.current?.present()}
        className={clsx(
          "flex flex-row items-center justify-between rounded-lg bg-base-600 px-4 py-2",
          className
        )}
      >
        {renderValue(value)}
        <Icon
          color="white"
          name="chevron-down-outline"
          className="ml-2"
          size={16}
        />
      </Pressable>

      <BottomSheetModal ref={ref} snapPoints={["75%", "100%"]}>
        <SelectCtx.Provider value={{ handleChange, multiple, value }}>
          <BottomSheetScrollView className="p-4">
            <View className="p-4">{children}</View>
          </BottomSheetScrollView>
        </SelectCtx.Provider>
      </BottomSheetModal>
    </>
  );
};

export const SelectItem: FC<{
  children: ReactNode;
  value: string;
  className?: string;
}> = ({ children, value, className }) => {
  const context = useContext(SelectCtx);

  if (!context) {
    throw new Error("SelectItem must be used inside Select");
  }

  return (
    <Pressable
      onPress={() => context.handleChange(value)}
      className={className}
    >
      {children}
    </Pressable>
  );
};
