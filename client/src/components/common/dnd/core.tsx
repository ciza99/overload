import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
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
  withSpring,
  SharedValue,
  useAnimatedRef,
  MeasuredDimensions,
  useDerivedValue,
  useAnimatedReaction,
  withTiming,
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
    (overId) => runOnJS(setIsOver)(id === overId)
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
      active.value === id
        ? {
            transform: [
              { translateX: translateX.value },
              { translateY: translateY.value },
            ],
          }
        : {},
    [id]
  );

  useEffect(() => {
    register(id, "draggable", ref);

    return () => unregister(id, "draggable");
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
  createGesture: (key: Key) => PanGesture;
  onDragStart?: () => void;
  onDragUpdate?: () => void;
  onDragEnd?: () => void;
};

export const DndProvider = ({
  children,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  modifiers: initialModifiers = [],
}: {
  children: ReactNode;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragUpdate?: () => void;
  modifiers?: Modifier[];
}) => {
  const [draggables, setDraggables] = useState<
    Record<Key, RefObject<Animated.View>>
  >({});
  const [droppables, setDroppables] = useState<
    Record<Key, RefObject<Animated.View>>
  >({});

  const modifiers = useSharedValue<Modifier[]>(initialModifiers);

  const previous = useSharedValue<Key | null>(null);
  const active = useSharedValue<Key | null>(null);
  const over = useSharedValue<Key | null>(null);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const activeRect = useSharedValue<MeasuredDimensions | null>(null);
  const droppableRects = useSharedValue<Record<Key, MeasuredDimensions>>({});

  const transitioning = useSharedValue({ x: false, y: false });

  useAnimatedReaction(
    () => active.value,
    (active) => {
      if (previous.value !== active && active !== null) {
        previous.value = active;
      }
    }
  );

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

  useAnimatedReaction(
    () => [transitioning.value],
    ([{ x, y }]) => {
      if (!x && !y) {
        active.value = null;
      }
    }
  );

  const createGesture = useCallback(
    (id: Key) =>
      Gesture.Pan()
        .enabled(active.value === null || active.value === id)
        .onStart(() => {
          if (onDragStart) {
            runOnJS(onDragStart)();
          }

          active.value = id;
          activeRect.value = measure(draggables[id]);

          const rects = calculateRects(droppables);
          droppableRects.value = rects;
        })
        .onUpdate((event) => {
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
          if (onDragEnd) {
            runOnJS(onDragEnd)();
          }

          translateX.value = withTiming(0, {}, () => {
            transitioning.value.x = false;
          });
          translateY.value = withTiming(0, {}, () => {
            transitioning.value.y = false;
          });

          activeRect.value = null;
          over.value = null;
        }),
    [draggables, droppables, onDragStart, onDragUpdate, onDragEnd]
  );

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
        unregister,
        onDragStart,
        onDragUpdate,
        onDragEnd,
      }}
    >
      {children}
    </DndContext.Provider>
  );
};
