import { useTransition } from "@components/animations/use-transition";
import { Collapsable, Button } from "@components/common";
import {
  DndProvider,
  useDraggable,
  useDroppable,
} from "@components/common/dnd";
import clsx from "clsx";
import { useState } from "react";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedProps } from "react-native-reanimated";

export const Training = () => {
  const [open, setOpen] = useState(false);

  const { persisted } = useTransition(open);
  console.log({ persisted });

  return (
    <DndProvider>
      <View className="gap-y-4">
        <Droppable />
        <Draggable />
      </View>
      <Collapsable open={open}>
        <View className="bg-red-500 h-12" />
      </Collapsable>
      <Button onPress={() => setOpen((o) => !o)}>Toggle</Button>
    </DndProvider>
  );
};

const Droppable = () => {
  const { ref, isOver } = useDroppable(`${0}`);

  return (
    <Animated.View
      ref={ref}
      className={clsx("border border-base-300 h-12 w-full", {
        "border-red-300": isOver,
      })}
    />
  );
};

const Draggable = () => {
  const { ref, style, gesture } = useDraggable(`${0}`);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={style}
        ref={ref}
        className={clsx("border border-primary h-12 w-full")}
      />
    </GestureDetector>
  );
};
