import { ReactNode } from "react";

import { Typography } from "../typography/typography";

type NativeNodeProps = {
  children: ReactNode;
};

export const NativeNode = ({ children }: NativeNodeProps) => {
  return typeof children === "string" ? (
    <Typography>{children}</Typography>
  ) : (
    <>children</>
  );
};
