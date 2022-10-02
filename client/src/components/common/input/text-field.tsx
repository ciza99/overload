import { ReactNode, useCallback } from "react";
import { animated, useTransition } from "@react-spring/native";
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";
import { useField } from "formik";

import { Box } from "@components/common/box/box";
import { NativeNode } from "@components/common/native-node/native-node";
import { Typography } from "@components/common/typography/typography";
import { SxProp } from "@components/theme/sx/sx-types";
import { useSxStyle } from "@components/theme/sx/use-sx-style";
import { useTheme } from "@components/theme";

type TextFieldProps = Omit<
  TextInputProps,
  "value" | "onChangeText" | "onChange" | "onBlur" | "style"
> & {
  name: string;
  label?: ReactNode;
  sx?: SxProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  inputSx?: SxProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  containerSx?: SxProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const AnimatedTypography = animated(Typography);

export const TextField = ({
  name,
  label,
  style,
  sx,
  inputStyle,
  inputSx,
  containerSx,
  containerStyle,
  ...rest
}: TextFieldProps) => {
  const [field, meta, helpers] = useField<string>(name);
  const theme = useTheme();
  const inputSxStyle = useSxStyle(inputSx);
  const transitions = useTransition(meta.touched && meta.error, {
    from: {
      opacity: 0,
      scaleY: 0,
      height: 0,
      marginTop: 0,
    },
    enter: {
      opacity: 1,
      scaleY: 1,
      height: 20,
      marginTop: theme.spacing(2),
    },
    leave: {
      opacity: 0,
      scaleY: 0,
      height: 0,
      marginTop: 0,
    },
  });

  const handleChange = useCallback(
    (text: string) => helpers.setValue(text),
    [helpers]
  );

  const handleBlur = useCallback(() => helpers.setTouched(true), [helpers]);

  return (
    <Box sx={sx} style={style}>
      {label && (
        <Box sx={{ mb: 1 }}>
          <NativeNode>{label}</NativeNode>
        </Box>
      )}
      <Box
        sx={[
          {
            p: 2,
            backgroundColor: theme.palette.background,
            width: 1,
            display: "flex",
          },
          ...(Array.isArray(containerSx) ? containerSx : [containerSx]),
        ]}
        style={containerStyle}
      >
        <TextInput
          selectionColor={theme.palette.primary}
          keyboardAppearance={theme.mode}
          placeholderTextColor={theme.palette.muted}
          onChangeText={handleChange}
          onBlur={handleBlur}
          value={field.value}
          style={[
            {
              color: theme.palette.text,
              height: theme.spacing(8),
              ...theme.typography.body1,
            },
            inputSxStyle,
            inputStyle,
          ]}
          {...rest}
        />
      </Box>
      {transitions(
        ({ opacity, scaleY, height, marginTop }, error) =>
          error && (
            <AnimatedTypography
              color="danger"
              variant="body2"
              style={{ transform: [{ scaleY }], opacity, height, marginTop }}
            >
              {error}
            </AnimatedTypography>
          )
      )}
    </Box>
  );
};
