import { useState } from "react";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { Typography } from ".";
import {
  arrayMove,
  DndContext,
  restrictToYAxis,
  ScrollContainer,
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
        <ScrollContainer className="flex p-4">
          {items.map((item) => (
            <Item key={item} id={item} />
          ))}
        </ScrollContainer>
      </SortableContext>
    </DndContext>
  );
};

const Item = ({ id }: { id: string }) => {
  const { ref, style, panGesture } = useSortable(id);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        ref={ref}
        style={style}
        className="mt-4 w-1/2 rounded-lg bg-base-600 p-4"
      >
        <Typography weight="bold" className="text-center">
          {id}
        </Typography>
      </Animated.View>
    </GestureDetector>
  );
};
