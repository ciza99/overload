import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";

import { useStore } from "@features/core/hooks/use-store";
import {
  Button,
  Divider,
  Icon,
  Paper,
  Typography,
} from "@features/ui/components";

import { colors } from "../theme";

export const Dialog = () => {
  const { dialogs, close } = useStore((state) => state.dialog);
  const dialog = dialogs[dialogs.length - 1];

  return (
    dialog && (
      <Animated.View
        className="absolute inset-0 z-10"
        entering={FadeIn}
        exiting={FadeOut}
      >
        <TouchableWithoutFeedback onPress={() => close(dialog.id)}>
          <View className="absolute inset-0 bg-black/75" />
        </TouchableWithoutFeedback>
        <Animated.View
          pointerEvents="box-none"
          className="w-full flex-1 justify-center"
          entering={ZoomIn}
          exiting={ZoomOut}
        >
          <KeyboardAvoidingView
            className="m-4"
            behavior="padding"
            keyboardVerticalOffset={100}
          >
            <Paper className="relative max-h-full w-full rounded-lg">
              <View className="flex flex-row items-center justify-between p-4">
                <Typography weight="bold" className="text-base-200">
                  {dialog.title}
                </Typography>
                <Button
                  className="h-6 w-6 p-0"
                  variant="secondary"
                  onPress={() => close(dialog.id)}
                >
                  <Icon size={18} color={colors.primary} name="close" />
                </Button>
              </View>
              <Divider />
              <View className="max-h-[400px] p-4">
                <dialog.Component
                  {...dialog.props}
                  id={dialog.id}
                  close={() => close(dialog.id)}
                />
              </View>
            </Paper>
          </KeyboardAvoidingView>
        </Animated.View>
      </Animated.View>
    )
  );
};
