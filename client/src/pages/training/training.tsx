import {
  DndProvider,
  useDraggable,
  useDroppable,
} from "@components/common/dnd";
import clsx from "clsx";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

export const Training = () => {
  return (
    <DndProvider>
      <View className="gap-y-4">
        <Droppable />
        <Draggable />
      </View>
    </DndProvider>
  );
};

const Droppable = () => {
  const { setRef, onLayout, isOver } = useDroppable(0);

  return (
    <View
      ref={setRef}
      onLayout={onLayout}
      className={clsx("border border-base-300 h-12 w-full", {
        "border-red-300": isOver,
      })}
    />
  );
};

const Draggable = () => {
  const { setRef, onLayout, style, gesture } = useDraggable(0);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={style}
        ref={setRef}
        onLayout={onLayout}
        className={clsx("border border-primary h-12 w-full")}
      />
    </GestureDetector>
  );
};
