import cx from "clsx";

import { Typography, TypographyProps } from "../typography/typography";

type TextButtonProps = TypographyProps;

export const TextButton = ({ tw, ...rest }: TextButtonProps) => {
  return <Typography tw={cx(tw, "text-primary")} weight="semibold" {...rest} />;
};
