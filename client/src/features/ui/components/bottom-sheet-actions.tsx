import { Fragment, ReactNode } from "react";

import { Button, Divider } from "@features/ui/components";

export type Action = {
  icon?: ReactNode;
  label: string;
  onPress: () => void;
};

export const BottomSheetActions = ({ actions }: { actions: Action[] }) => {
  return (
    <>
      {actions.map(({ icon, label, onPress }) => (
        <Fragment key={label}>
          <Button
            className="justify-start bg-transparent"
            beforeIcon={icon}
            onPress={onPress}
          >
            {label}
          </Button>
          <Divider className="my-1" />
        </Fragment>
      ))}
    </>
  );
};
