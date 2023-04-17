import { Modal, Pressable } from "react-native";

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
      <Modal transparent={true} className="grow">
        <Animated.View className="grow" entering={FadeIn} exiting={FadeOut}>
          <Pressable
            onPress={() => close(dialog.id)}
            className="p-2 bg-black/30 flex-1 justify-center items-center"
          >
            <Animated.View entering={ZoomIn} exiting={ZoomOut}>
              <Paper className="p-4">
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
          </Pressable>
        </Animated.View>
      </Modal>
    )
  );
};
