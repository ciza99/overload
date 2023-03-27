import clsx from "clsx";

import { Typography, TypographyProps } from "@components/common/typography";

type TextButtonProps = TypographyProps;

export const TextButton = ({ className, ...rest }: TextButtonProps) => {
  return (
    <Typography
      weight="bold"
      className={clsx("text-primary", className)}
      {...rest}
    />
  );
};
