import {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Animated, {
  useAnimatedStyle,
  runOnJS,
  measure,
  useSharedValue,
  SharedValue,
  useAnimatedRef,
  MeasuredDimensions,
  useAnimatedReaction,
  withSpring,
} from "react-native-reanimated";
import { Gesture, PanGesture } from "react-native-gesture-handler";
import { Key, Modifier, NodeType } from "./types";
import { calculateRects, calculateIntersections } from "./helpers";

export const useDroppable = (id: Key) => {
  const ref = useAnimatedRef<Animated.View>();
  const { register, unregister, over } = useDndCtx();
  const [isOver, setIsOver] = useState(false);

  useAnimatedReaction(
    () => over.value,
    (overId) => {
      const isOverUpdated = id == overId;
      if (isOver == isOverUpdated) {
        return;
      }
      runOnJS(setIsOver)(id == overId);
    },
    [isOver]
  );

  useEffect(() => {
    register(id, "droppable", ref);

    return () => {
      unregister(id, "droppable");
    };
  }, [id]);

  return {
    isOver,
    over,
    ref,
  };
};

export const useDraggable = (id: Key) => {
  const ref = useAnimatedRef<Animated.View>();
  const {
    active,
    translateX,
    translateY,
    register,
    unregister,
    createGesture,
  } = useDndCtx();

  const style = useAnimatedStyle(
    () =>
      active.value == id
        ? {
            transform: [
              { translateX: translateX.value },
              { translateY: translateY.value },
            ],
          }
        : {
            transform: [
              { translateX: withSpring(0) },
              { translateY: withSpring(0) },
            ],
          },
    [id]
  );

  useEffect(() => {
    register(id, "draggable", ref);

    return () => {
      unregister(id, "draggable");
    };
  }, [id]);

  const gesture = useMemo(() => createGesture(id), [id, createGesture]);

  return {
    gesture,
    style,
    ref,
  };
};

const DndContext = createContext<DndContextType>(undefined as never);
export const useDndCtx = () => useContext(DndContext);

type RegisterFnc = (
  id: Key,
  type: NodeType,
  ref: RefObject<Animated.View>
) => void;
type UnregisterFnc = (id: Key, type: NodeType) => void;
type DndContextType = {
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  active: SharedValue<Key | null>;
  over: SharedValue<Key | null>;
  draggables: Record<Key, RefObject<Animated.View>>;
  droppables: Record<Key, RefObject<Animated.View>>;
  droppableRects: SharedValue<Record<Key, MeasuredDimensions>>;
  register: RegisterFnc;
  unregister: UnregisterFnc;
  dragging: boolean;
  createGesture: (key: Key) => PanGesture;
};

type Active = {
  id: Key;
  rect: MeasuredDimensions | null;
};

type Over = {
  id: Key;
};

type DndEvent = {
  active: Active;
  over: Over | null;
  translate: {
    x: number;
    y: number;
  };
};

export const DndProvider = ({
  children,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  modifiers: initialModifiers = [],
}: {
  children: ReactNode;
  onDragStart?: (event: DndEvent) => void;
  onDragEnd?: (event: DndEvent) => void;
  onDragUpdate?: (event: DndEvent) => void;
  modifiers?: Modifier[];
}) => {
  const [dragging, setDragging] = useState(false);
  const [draggables, setDraggables] = useState<
    Record<Key, RefObject<Animated.View>>
  >({});
  const [droppables, setDroppables] = useState<
    Record<Key, RefObject<Animated.View>>
  >({});

  const modifiers = useSharedValue<Modifier[]>(initialModifiers);

  const active = useSharedValue<Key | null>(null);
  const over = useSharedValue<Key | null>(null);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const activeRect = useSharedValue<MeasuredDimensions | null>(null);
  const droppableRects = useSharedValue<Record<Key, MeasuredDimensions>>({});
  const updatesCount = useSharedValue(0);

  const register = (
    key: Key,
    type: "draggable" | "droppable",
    ref: RefObject<Animated.View>
  ) => {
    const setter = type === "draggable" ? setDraggables : setDroppables;
    setter((prev) => ({ ...prev, [key]: ref }));
  };

  const unregister = (key: Key, type: "draggable" | "droppable") => {
    const setter = type === "draggable" ? setDraggables : setDroppables;
    setter((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleDragEnd = (
    onDragEnd: ((event: DndEvent) => void) | undefined,
    eventProps: DndEvent
  ) => {
    console.log("handling drag end");
    onDragEnd?.(eventProps);
    console.log("setting values");
    setDragging(false);
    active.value = null;
    activeRect.value = null;
    over.value = null;
  };

  useAnimatedReaction(
    () => [active.value, over.value],
    ([active, over]) => {
      console.log({ active, over });
    },
    []
  );

  const createGesture = useMemo(() => {
    return (id: Key) =>
      Gesture.Pan()
        .onStart((event) => {
          runOnJS(setDragging)(true);
          active.value = id;
          const rect = measure(draggables[id]);
          activeRect.value = rect;

          const rects = calculateRects(droppables);
          droppableRects.value = rects;

          if (onDragStart) {
            runOnJS(onDragStart)({
              active: {
                id: active.value,
                rect,
              },
              over:
                over.value !== null
                  ? {
                      id: over.value,
                    }
                  : null,
              translate: {
                x: translateX.value,
                y: translateY.value,
              },
            });
          }
        })
        .onUpdate((event) => {
          updatesCount.value = updatesCount.value + 1;
          if (!activeRect.value) {
            return;
          }

          const { translateX: tx, translateY: ty } = modifiers.value.reduce(
            (acc, modifier) =>
              modifier({
                active: active.value,
                over: over.value,
                activeRect: activeRect.value,
                droppableRects: droppableRects.value,
                ...acc,
              }),
            { translateX: event.translationX, translateY: event.translationY }
          );

          translateX.value = tx;
          translateY.value = ty;

          const sourceRect: MeasuredDimensions = {
            ...activeRect.value,
            pageX: activeRect.value.pageX + event.translationX,
            pageY: activeRect.value.pageY + event.translationY,
          };

          const intersections = calculateIntersections(
            sourceRect,
            droppableRects.value
          );

          const newOver = intersections.find((i) => i.ratio > 0)?.key ?? null;

          over.value = newOver;
        })
        .onEnd(() => {
          if (active.value) {
            runOnJS(handleDragEnd)(onDragEnd, {
              active: {
                id: active.value,
                rect: activeRect.value,
              },
              over:
                over.value !== null
                  ? {
                      id: over.value,
                    }
                  : null,
              translate: {
                x: translateX.value,
                y: translateY.value,
              },
            });
          }
        });
  }, [draggables, droppables, onDragStart, onDragUpdate, onDragEnd]);

  // const createGesture = useCallback([
  //   draggables,
  //   droppables,
  //   onDragStart,
  //   onDragUpdate,
  //   onDragEnd,
  // ]);

  return (
    <DndContext.Provider
      value={{
        translateX,
        translateY,
        active,
        over,
        createGesture,
        draggables,
        droppables,
        droppableRects,
        register,
        dragging,
        unregister,
      }}
    >
      {children}
    </DndContext.Provider>
  );
};
