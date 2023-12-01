import clsx from "clsx";

import {
  Typography,
  TypographyProps,
} from "@features/ui/components/typography";

type TextButtonProps = TypographyProps;

export const TextButton = ({ className, ...rest }: TextButtonProps) => {
  return (
    <Typography
      weight="bold"
      className={clsx("text-base text-primary", className)}
      {...rest}
    />
  );
};
