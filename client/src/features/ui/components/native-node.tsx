import { ReactNode } from "react";

import { Typography } from "@features/ui/components/typography";

type NativeNodeProps = {
  children: ReactNode;
  textClassName?: string;
};

export const NativeNode = ({ children, textClassName }: NativeNodeProps) => {
  return typeof children === "string" ? (
    <Typography className={textClassName}>{children}</Typography>
  ) : (
    <>{children}</>
  );
};
