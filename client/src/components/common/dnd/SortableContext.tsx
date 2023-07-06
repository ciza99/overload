import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  MeasuredDimensions,
  SharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import { useDndContext } from "./DndContext";
import { NodeId } from "./types";

const SortableCtx = createContext<SortableContextType>(undefined as never);
export const useSortableContext = () => useContext(SortableCtx);

type SortableContextType = {
  items: NodeId[];
  rects: Readonly<SharedValue<MeasuredDimensions[]>>;
  activeIndex: Readonly<SharedValue<number>>;
  overIndex: Readonly<SharedValue<number>>;
};

export const SortableContext = ({
  items,
  children,
}: {
  items: NodeId[];
  children: ReactNode;
}) => {
  const { active, over, droppableRects } = useDndContext();

  const activeIndex = useDerivedValue(
    () => (active.value ? items.indexOf(active.value) : -1),
    [items]
  );
  const overIndex = useDerivedValue(
    () => (over.value ? items.indexOf(over.value) : -1),
    [items]
  );

  const rects = useDerivedValue(
    () => items.map((id) => droppableRects.value[id]),
    [items]
  );

  // useEffect(() => {
  //   console.log({ items, dragging });
  // }, [items, dragging]);

  const ctx: SortableContextType = {
    items,
    rects,
    activeIndex,
    overIndex,
  };

  return <SortableCtx.Provider value={ctx}>{children}</SortableCtx.Provider>;
};
