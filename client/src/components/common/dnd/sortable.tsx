import {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  AnimatableValue,
  Animation,
  defineAnimation,
} from "react-native-reanimated";
import { useDndContext } from "./DndContext";
import { useSortableContext } from "./SortableContext";
import { useDraggable } from "./draggable";
import { useDroppable } from "./droppable";
import { rectSortingStrategy } from "./sorting-strategy";
import { NodeId, Transform } from "./types";
import { useRef } from "react";

interface PausableAnimation extends Animation<PausableAnimation> {
  lastTimestamp: number;
  elapsed: number;
}

export const withPause = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _nextAnimation: any,
  paused: SharedValue<boolean>
) => {
  "worklet";
  return defineAnimation<PausableAnimation>(_nextAnimation, () => {
    "worklet";
    const nextAnimation: PausableAnimation =
      typeof _nextAnimation === "function" ? _nextAnimation() : _nextAnimation;
    const onFrame = (state: PausableAnimation, now: number) => {
      const { lastTimestamp, elapsed } = state;
      if (paused.value) {
        state.elapsed = now - lastTimestamp;
        return false;
      }
      const dt = now - elapsed;
      const finished = nextAnimation.onFrame(nextAnimation, dt);
      state.current = nextAnimation.current;
      state.lastTimestamp = dt;
      return finished;
    };
    const onStart = (
      state: PausableAnimation,
      value: AnimatableValue,
      now: number,
      previousState: PausableAnimation
    ) => {
      state.lastTimestamp = now;
      state.elapsed = 0;
      state.current = 0;
      nextAnimation.onStart(nextAnimation, value, now, previousState);
    };
    const callback = (finished?: boolean): void => {
      if (nextAnimation.callback) {
        nextAnimation.callback(finished);
      }
    };
    return {
      onFrame,
      onStart,
      isHigherOrder: true,
      current: nextAnimation.current,
      callback,
      previousAnimation: null,
      startTime: 0,
      started: false,
      lastTimestamp: 0,
      elapsed: 0,
    };
  });
};

export const useSortable = (id: NodeId) => {
  const { dragging, active, tx: dragTx, ty: dragTy } = useDndContext();
  const { items, rects, activeIndex, overIndex } = useSortableContext();
  const { ref: draggableRef, panGesture, isDragging } = useDraggable(id);
  const { ref: droppableRef, isOver } = useDroppable(id);

  const previousItems = useSharedValue(items);

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const index = useDerivedValue(() => items.indexOf(id), [items, id]);

  const rect = useDerivedValue(() => {
    if (index.value === -1) {
      return null;
    }
    return rects.value[index.value];
  });

  const sortDisplace = useDerivedValue(() =>
    rectSortingStrategy({
      index: index.value,
      rects: rects.value,
      activeIndex: activeIndex.value,
      overIndex: overIndex.value,
    })
  );

  const style = useAnimatedStyle(() => {
    if (active.value === id) {
      return {
        transform: [{ translateX: dragTx.value }, { translateY: dragTy.value }],
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
  });

  return { isDragging, isOver, draggableRef, droppableRef, panGesture, style };
};
