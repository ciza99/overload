import { Modal, TouchableWithoutFeedback, View } from "react-native";

import { useStore } from "@components/store/use-store";
import { Typography, Paper } from "@components/common";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";

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
          <View className="px-4 py-16 bg-black/50 flex-1 justify-center items-center">
            <TouchableWithoutFeedback>
              <Animated.View
                entering={ZoomIn}
                exiting={ZoomOut}
                className="w-full"
              >
                <Paper className="p-4 w-full rounded-xl">
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    )
  );
};
