import { useEffect, useMemo } from "react";
import {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

import { useDndContext } from "./DndContext";
import { useDraggable } from "./draggable";
import { useDroppable } from "./droppable";
import { useSortableContext } from "./SortableContext";
import { rectSortingStrategy } from "./sorting-strategy";
import { NodeId } from "./types";

export const useSortable = (id: NodeId) => {
  const { dragging, active, position, transform } = useDndContext();
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

  useEffect(() => {
    if (dragging) return;

    const timeout = setTimeout(() => {
      active.value = null;
      transform.value = { x: 0, y: 0 };
    });

    return () => clearTimeout(timeout);
  }, [dragging]);

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
        { translateX: withTiming(sortDisplace.value.tx, { duration: 250 }) },
        { translateY: withTiming(sortDisplace.value.ty, { duration: 250 }) },
      ],
    };
  }, [dragging]);

  const refs = useMemo(
    () => ({ draggable: draggableRef, droppable: droppableRef }),
    [draggableRef, droppableRef]
  );

  return { dragging, isDragging, isOver, refs, panGesture, style };
};
