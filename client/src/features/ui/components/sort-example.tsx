import { useState } from "react";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { Typography } from ".";
import {
  arrayMove,
  DndContext,
  restrictToYAxis,
  SortableContext,
  useSortable,
} from "./dnd";

export const SortExample = () => {
  const [items, setItems] = useState([
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
  ]);

  return (
    <DndContext
      modifiers={[restrictToYAxis]}
      onDragEnd={({ active, over }) => {
        const activeIndex = items.findIndex((id) => active.id === id);
        const overIndex = items.findIndex((id) => over?.id === id);

        if (
          overIndex === -1 ||
          activeIndex === -1 ||
          activeIndex === overIndex
        ) {
          return;
        }

        setItems(arrayMove(items, activeIndex, overIndex));
      }}
    >
      <SortableContext items={items}>
        <View className="p-4 flex">
          {items.map((item) => (
            <Item key={item} id={item} />
          ))}
        </View>
      </SortableContext>
    </DndContext>
  );
};

const Item = ({ id }: { id: string }) => {
  const { refs, style, panGesture } = useSortable(id);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        ref={refs.draggable}
        style={style}
        className="p-4 bg-base-600 mt-4 w-1/2 rounded-lg"
      >
        <Animated.View ref={refs.droppable}>
          <Typography weight="bold" className="text-center">
            {id}
          </Typography>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
