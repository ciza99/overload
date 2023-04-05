import {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MeasuredDimensions,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useDndCtx, useDraggable, useDroppable } from "./core";
import { Key } from "./types";

export function mergeRefs<T>(
  ...refs: MutableRefObject<T>[]
): (node: T) => void {
  return useMemo(
    () => (node: T) => {
      refs.forEach((ref) => (ref.current = node));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}

const move = <TItem,>(array: TItem[], from: number, to: number) => {
  "worklet";
  const newArray = array.slice();
  newArray.splice(
    to < 0 ? newArray.length + to : to,
    0,
    newArray.splice(from, 1)[0]
  );

  return newArray;
};

export const useSortable = (id: Key) => {
  const { ref: draggableRef, gesture } = useDraggable(id);
  const { ref: droppableRef, isOver } = useDroppable(id);
  const { active, translateX, translateY, over } = useDndCtx();
  const { items, sortedRects, activeIndex, overIndex } = useSortableCtx();

  const translate = useDerivedValue(() => {
    if (!active.value || !over.value) {
      return null;
    }

    const index = items.indexOf(id);

    if (index === -1 || activeIndex.value === -1 || overIndex.value === -1) {
      return null;
    }

    const newRects = move(
      sortedRects.value,
      overIndex.value,
      activeIndex.value
    );

    const oldRect = sortedRects.value[index];
    const newRect = newRects[index];

    return {
      x: newRect.pageX - oldRect.pageX,
      y: newRect.pageY - oldRect.pageY,
    };
  }, [id]);

  const style = useAnimatedStyle(() => {
    if (active.value === id) {
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
        ],
      };
    }

    return {
      transform: [
        { translateX: withTiming(translate.value?.x ?? 0, { duration: 250 }) },
        { translateY: withTiming(translate.value?.y ?? 0, { duration: 250 }) },
      ],
    };
  });

  return {
    ref: mergeRefs(draggableRef, droppableRef),
    draggableRef,
    droppableRef,
    style,
    gesture,
    over,
    isOver,
  };
};

type SortableCtxType = {
  items: Key[];
  sortedRects: Readonly<SharedValue<MeasuredDimensions[]>>;
  activeIndex: SharedValue<number>;
  overIndex: SharedValue<number>;
};

const SortableCtx = createContext<SortableCtxType>(undefined as never);
const useSortableCtx = () => useContext(SortableCtx);

export const SortableProvider = ({
  items,
  children,
}: {
  items: Key[];
  children: ReactNode;
}) => {
  const { active, over, droppableRects } = useDndCtx();
  const activeIndex = useDerivedValue(
    () => (active.value ? items.indexOf(active.value) : -1),
    [items]
  );
  const overIndex = useDerivedValue(
    () => (over.value ? items.indexOf(over.value) : -1),
    [items]
  );

  const sortedRects = useDerivedValue(
    () => items.map((item) => droppableRects.value[item]),
    [items]
  );

  return (
    <SortableCtx.Provider
      value={{ items, sortedRects, activeIndex, overIndex }}
    >
      {children}
    </SortableCtx.Provider>
  );
};
