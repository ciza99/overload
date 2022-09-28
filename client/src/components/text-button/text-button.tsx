import { Typography, TypographyProps } from "../typography/typography";

type TextButtonProps = TypographyProps;

export const TextButton = ({ sx, ...rest }: TextButtonProps) => {
  return (
    <Typography
      sx={[
        (theme) => ({
          color: theme.palette.primary,
          ...theme.typography.button,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  );
};
