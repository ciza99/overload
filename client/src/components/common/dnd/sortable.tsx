import {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  MeasuredDimensions,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
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

export const arrayMove = <TItem,>(array: TItem[], from: number, to: number) => {
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
  const { active, translateX: dragX, translateY: dragY, over } = useDndCtx();
  const { items, sortedRects, updatedRects } = useSortableCtx();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const index = items.indexOf(id);

  useAnimatedReaction(
    () => ({
      sortedRects: sortedRects.value,
      updatedRects: updatedRects.value,
    }),
    ({ sortedRects, updatedRects }) => {
      const oldRect = sortedRects[index];
      const newRect = updatedRects[index];

      if (index === -1 || !oldRect || !newRect) {
        return { x: 0, y: 0 };
      }

      const x = newRect.pageX - oldRect.pageX;
      const y = newRect.pageY - oldRect.pageY;
      translateX.value = withTiming(x);
      translateY.value = withTiming(y);
    },
    [index]
  );

  const style = useAnimatedStyle(() => {
    if (active.value == id) {
      return {
        transform: [{ translateX: dragX.value }, { translateY: dragY.value }],
      };
    }

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
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
  updatedRects: Readonly<SharedValue<MeasuredDimensions[]>>;
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
  const { active, over, droppableRects, dragging } = useDndCtx();
  const activeIndex = useDerivedValue(
    () => (active.value ? items.findIndex((id) => id == active.value) : -1),
    [items]
  );

  const overIndex = useDerivedValue(
    () => (over.value ? items.findIndex((id) => id == over.value) : -1),
    [items]
  );

  const sortedRects = useDerivedValue(
    () => items.map((id) => droppableRects.value[id]),
    [items]
  );

  const updatedRects = useDerivedValue(() => {
    if (activeIndex.value === -1 || overIndex.value === -1) {
      return sortedRects.value;
    }

    return arrayMove(sortedRects.value, overIndex.value, activeIndex.value);
  }, []);

  useEffect(() => {
    console.log({ dragging });
  }, [dragging]);

  useEffect(() => {
    console.log("items changed");
  }, [items]);

  return (
    <SortableCtx.Provider
      value={{ items, sortedRects, updatedRects, activeIndex, overIndex }}
    >
      {children}
    </SortableCtx.Provider>
  );
};
