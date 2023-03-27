import { View, Modal, Pressable } from "react-native";

import { useStore } from "@components/store/use-store";
import { Typography, Paper } from "@components/common";
import { animated, useTransition } from "@react-spring/native";

const AnimatedPressable = animated(Pressable);
const AnimatedPaper = animated(Paper);

export const Dialog = () => {
  const { dialogs, close } = useStore((state) => state.dialog);
  const dialog = dialogs[dialogs.length - 1];
  const transition = useTransition(dialog, {
    from: {
      opacity: 0,
      scale: 0.5,
    },
    enter: {
      opacity: 1,
      scale: 1,
    },
    leave: {
      opacity: 0,
      scale: 0.5,
    },
    config: {
      tension: 300,
    },
  });

  return transition(
    ({ opacity, scale }, dialog) =>
      dialog && (
        <Modal transparent={true}>
          <AnimatedPressable
            onPress={() => close(dialog.id)}
            style={{ opacity }}
            className="p-2 bg-black/30 flex-1 justify-center items-center"
          >
            <AnimatedPaper
              className="p-4"
              style={{ opacity, transform: [{ scale }] }}
            >
              {dialog.title && (
                <Typography weight="bold" className="pb-4 text-base-200">
                  {dialog.title}
                </Typography>
              )}
              {
                <dialog.Component
                  {...dialog.props}
                  id={dialog.id}
                  close={() => close(dialog.id)}
                />
              }
            </AnimatedPaper>
          </AnimatedPressable>
        </Modal>
      )
  );
};
