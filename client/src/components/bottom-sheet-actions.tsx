import { ReactNode } from "react";
import { Button, Divider } from "@components/common";

export type Action = {
  icon?: ReactNode;
  label: string;
  onPress: () => void;
};

export const BottomSheetActions = ({ actions }: { actions: Action[] }) => {
  return (
    <>
      {actions.map(({ icon, label, onPress }) => (
        <>
          <Button
            className="justify-start bg-transparent"
            beforeIcon={icon}
            onPress={onPress}
          >
            {label}
          </Button>
          <Divider className="my-1" />
        </>
      ))}
    </>
  );
};
