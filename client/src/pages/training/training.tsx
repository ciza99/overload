import { Collapsable, Button } from "@components/common";
import { DndContext, useDraggable, useDroppable } from "@components/common/dnd";
import clsx from "clsx";
import { useState } from "react";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

export const Training = () => {
  const [open, setOpen] = useState(false);

  return (
    <DndContext>
      <View>
        <Droppable />
        <Draggable />
      </View>
      <Collapsable open={open}>
        <View className="bg-red-500 h-12" />
      </Collapsable>
      <Button onPress={() => setOpen((o) => !o)}>Toggle</Button>
    </DndContext>
  );
};

const Droppable = () => {
  const { ref, isOver } = useDroppable(0);

  return (
    <Animated.View
      ref={ref}
      className={clsx("border border-base-300 h-12 w-full mb-4", {
        "border-red-300": isOver,
      })}
    />
  );
};

const Draggable = () => {
  const { ref, style, panGesture } = useDraggable(0);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={style}
        ref={ref}
        className={clsx("border border-primary h-12 w-full")}
      />
    </GestureDetector>
  );
};
