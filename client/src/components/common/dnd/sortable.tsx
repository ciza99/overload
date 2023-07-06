import {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { useDndContext } from "./DndContext";
import { useSortableContext } from "./SortableContext";
import { useDraggable } from "./draggable";
import { useDroppable } from "./droppable";
import { rectSortingStrategy } from "./sorting-strategy";
import { NodeId } from "./types";
import { useMemo } from "react";

export const useSortable = (id: NodeId) => {
  const { active, position } = useDndContext();
  const { items, rects, activeIndex, overIndex } = useSortableContext();
  const { ref: draggableRef, panGesture, isDragging } = useDraggable(id);
  const { ref: droppableRef, isOver } = useDroppable(id);

  const index = useDerivedValue(() => items.indexOf(id), [items, id]);

  const sortDisplace = useDerivedValue(
    () =>
      rectSortingStrategy({
        index: index.value,
        rects: rects.value,
        activeIndex: activeIndex.value,
        overIndex: overIndex.value,
      }),
    []
  );

  const style = useAnimatedStyle(() => {
    if (active.value === id) {
      return {
        transform: [
          { translateX: position.value.x },
          { translateY: position.value.y },
        ],
      };
    }

    if (active.value === null) {
      return {
        transform: [{ translateX: 0 }, { translateY: 0 }],
      };
    }

    return {
      transform: [
        { translateX: withTiming(sortDisplace.value.tx) },
        { translateY: withTiming(sortDisplace.value.ty) },
      ],
    };
  }, []);

  const refs = useMemo(
    () => ({ draggable: draggableRef, droppable: droppableRef }),
    [draggableRef, droppableRef]
  );

  return { isDragging, isOver, refs, panGesture, style };
};
