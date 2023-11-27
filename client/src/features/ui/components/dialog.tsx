import {
  KeyboardAvoidingView,
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
import { Paper, Typography } from "@features/ui/components";

export const Dialog = () => {
  const { dialogs, close } = useStore((state) => state.dialog);
  const dialog = dialogs[dialogs.length - 1];

  return (
    dialog && (
      <Animated.View
        className="absolute top-0 left-0 right-0 bottom-0 z-10"
        entering={FadeIn}
        exiting={FadeOut}
      >
        <TouchableWithoutFeedback onPressIn={() => close(dialog.id)}>
          <View className="flex-1 items-center justify-center bg-black/50 px-4 py-16">
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={100}
                className="w-full"
              >
                <Animated.View
                  entering={ZoomIn}
                  exiting={ZoomOut}
                  className="w-full"
                >
                  <Paper className="w-full rounded-lg p-4">
                    {dialog.title && (
                      <Typography weight="bold" className="pb-4 text-base-200">
                        {dialog.title}
                      </Typography>
                    )}
                    <dialog.Component
                      {...dialog.props}
                      id={dialog.id}
                      close={() => close(dialog.id)}
                    />
                  </Paper>
                </Animated.View>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  );
};
