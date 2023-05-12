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
    <Modal transparent={true} visible={!!dialog} className="grow">
      {dialog && (
        <Animated.View className="grow" entering={FadeIn} exiting={FadeOut}>
          <TouchableWithoutFeedback onPressIn={() => close(dialog.id)}>
            <View className="p-8 bg-black/50 flex-1 justify-center items-center">
              <TouchableWithoutFeedback>
                <Animated.View
                  entering={ZoomIn}
                  exiting={ZoomOut}
                  className="w-full"
                >
                  <Paper className="p-4 w-full">
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
      )}
    </Modal>
  );
};
