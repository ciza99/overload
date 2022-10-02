import { useCallback } from "react";
import { useFormikContext } from "formik";
import { GestureResponderEvent } from "react-native";

import { ButtonProps, Button } from "@components/common/button/button";

export const SubmitButton = ({ onPress, ...rest }: ButtonProps) => {
  const { submitForm } = useFormikContext();

  const handlePress = useCallback(
    (event: GestureResponderEvent) => {
      onPress?.(event);
      submitForm();
    },
    [onPress, submitForm]
  );

  return <Button onPress={handlePress} {...rest} />;
};
