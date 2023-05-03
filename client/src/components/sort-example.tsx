import { useState } from "react";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { Typography } from "./common";
import {
  arrayMove,
  DndContext,
  SortableContext,
  useSortable,
} from "./common/dnd";

export const SortExample = () => {
  const [items, setItems] = useState(["A", "B", "C", "D", "E", "F", "G"]);

  return (
    <DndContext
      onDragEnd={({ active, over }) => {
        const activeIndex = items.findIndex((id) => active.id === id);
        const overIndex = items.findIndex((id) => over?.id === id);

        console.log({ active, over });

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
  const { draggableRef, droppableRef, style, panGesture } = useSortable(id);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        ref={draggableRef}
        style={style}
        className="p-4 bg-base-600 mt-4 rounded-lg"
      >
        <Animated.View ref={droppableRef}>
          <Typography weight="bold" className="text-center">
            {id}
          </Typography>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
