import { Text, TextProps, TextStyle } from "react-native";

import { Theme } from "components/theme/theme-types";
import { SxProp } from "components/theme/sx/sx-types";
import { useTheme } from "components/theme/theme-context";
import { useSxStyle } from "components/theme/sx/sx-hook";

export type TypographyProps = TextProps & {
  color?: keyof Theme["palette"];
  variant?: keyof Theme["typography"];
  sx?: SxProp<TextStyle>;
};

export const Typography = ({
  color,
  variant = "body1",
  sx,
  children,
  style,
  ...rest
}: TypographyProps) => {
  const sxStyle = useSxStyle(sx);
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme.palette.text },
        { ...theme.typography[variant] },
        color && { color: theme.palette[color] },
        sxStyle,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};