import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Gesture, PanGesture } from "react-native-gesture-handler";
import Animated, {
  measure,
  MeasuredDimensions,
  SharedValue,
  useDerivedValue,
  useAnimatedReaction,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import { rectIntersections } from "./collision-detection";
import { ModifierFnc } from "./modifiers";
import { Draggable, Droppable, NodeId, NodeType } from "./types";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { unstable_batchedUpdates } from "react-native";

const DndCtx = createContext<DndContextType>(undefined as never);
export const useDndContext = () => useContext(DndCtx);

export type DndContextType = {
  active: SharedValue<NodeId | null>;
  dragging: boolean;
  over: SharedValue<NodeId | null>;
  activeNode: Readonly<SharedValue<Draggable | null>>;
  overNode: Readonly<SharedValue<Droppable | null>>;
  transform: SharedValue<{ x: number; y: number }>;
  absolute: SharedValue<{ x: number; y: number }>;
  scrollOffset: SharedValue<{ x: number; y: number }>;
  position: SharedValue<{ x: number; y: number }>;
  register: RegisterFnc;
  unregister: UnregisterFnc;
  draggables: Record<string, Draggable>;
  droppables: Record<string, Droppable>;
  activeRect: Readonly<SharedValue<MeasuredDimensions | null>>;
  droppableRects: Readonly<SharedValue<Record<string, MeasuredDimensions>>>;
  panGestureFactory: (id: NodeId) => PanGesture;
};

type RegisterFnc = (
  id: NodeId,
  type: NodeType,
  ref: RefObject<Animated.View>
) => void;
type UnregisterFnc = (id: NodeId, type: NodeType) => void;

type OnDragEndFnc = (props: {
  active: Draggable;
  over: Droppable | null;
}) => void;

export const DndContext = ({
  modifiers: initialModifiers = [],
  onDragEnd,
  children,
}: {
  modifiers?: ModifierFnc[];
  onDragEnd?: OnDragEndFnc;
  children: ReactNode;
}) => {
  const [dragging, setDragging] = useState(false);
  const [draggables, setDraggables] = useState<Record<string, Draggable>>({});
  const [droppables, setDroppables] = useState<Record<string, Droppable>>({});

  const modifiers = useSharedValue(initialModifiers);

  const active = useSharedValue<NodeId | null>(null);
  const over = useSharedValue<NodeId | null>(null);

  const absolute = useSharedValue({ x: 0, y: 0 });
  const transform = useSharedValue({ x: 0, y: 0 });
  const scrollOffset = useSharedValue({ x: 0, y: 0 });

  const activeNode = useDerivedValue(
    () => (active.value !== null ? draggables[active.value] : null),
    [draggables]
  );
  const overNode = useDerivedValue(
    () => (over.value !== null ? droppables[over.value] : null),
    [droppables]
  );

  const position = useDerivedValue(() => {
    return {
      x: transform.value.x + scrollOffset.value.x,
      y: transform.value.y + scrollOffset.value.y,
    };
  }, []);

  const register: RegisterFnc = useCallback((id, type, ref) => {
    const setter = type === "draggable" ? setDraggables : setDroppables;
    setter((prev) => ({ ...prev, [id]: { id, ref } }));
  }, []);

  const unregister: UnregisterFnc = useCallback((id, type) => {
    const setter = type === "draggable" ? setDraggables : setDroppables;
    setter((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const activeRect = useDerivedValue<MeasuredDimensions | null>(() => {
    if (!activeNode.value) return null;
    return measure(activeNode.value.ref);
  }, []);

  const droppableRects = useDerivedValue(() => {
    if (active.value === null) return {};

    return Object.entries(droppables).reduce<
      Record<string, MeasuredDimensions>
    >((acc, [key, droppable]) => {
      const measured = measure(droppable.ref);
      if (!measured) return acc;
      return { ...acc, [key]: measured };
    }, {});
  }, [droppables]);

  const collisions = useDerivedValue(() => {
    if (!activeRect.value) return [];
    const activeRectTranslated = {
      ...activeRect.value,
      pageX: activeRect.value.pageX + position.value.x,
      pageY: activeRect.value.pageY + position.value.y,
    };
    return rectIntersections({
      activeRect: activeRectTranslated,
      droppableRects: droppableRects.value,
    });
  }, []);

  useAnimatedReaction(
    () => collisions.value,
    (collisions) => {
      const collision = collisions.find(({ ratio }) => ratio > 0) ?? null;
      if (collision === null) {
        over.value = null;
        return;
      }
      over.value = droppables[collision.id].id;
    },
    [droppables]
  );

  useAnimatedReaction(
    () => [over.value, active.value],
    ([over, active]) => {
      if (over === null || over === active) return;

      runOnJS(impactAsync)(ImpactFeedbackStyle.Light);
    },
    []
  );

  // useAnimatedReaction(
  //   () => ({
  //     active: active.value,
  //     activeNode: activeNode.value,
  //     over: over.value,
  //     overNode: overNode.value,
  //     activeRect: activeRect.value,
  //     collisions: collisions.value,
  //   }),
  //   (state) => {
  //     console.log(state);
  //   }
  // );

  const handleDragEnd = ({
    active: activeNode,
    over: overNode,
  }: {
    active: Draggable | null;
    over: Droppable | null;
  }) => {
    unstable_batchedUpdates(() => {
      if (activeNode) {
        onDragEnd?.({ active: activeNode, over: overNode });
      }
      setDragging(false);
    });
  };

  useEffect(() => {
    if (dragging) return;

    requestAnimationFrame(() => {
      active.value = null;
      over.value = null;
      transform.value = { x: 0, y: 0 };
    });
  }, [dragging]);

  // useAnimatedReaction(
  //   () => {},
  //   () => {
  //     if (!dragging) {
  //       runOnJS(reset)();
  //     }
  //   },
  //   [dragging]
  // );

  const panGestureFactory = useCallback(
    (id: NodeId) =>
      Gesture.Pan()
        .onBegin(() => {
          runOnJS(setDragging)(true);
          active.value = id;
          runOnJS(impactAsync)(ImpactFeedbackStyle.Medium);
        })
        .onUpdate((event) => {
          const { tx: mTx, ty: mTy } = modifiers.value.reduce(
            (prev, modifier) => modifier(prev),
            { tx: event.translationX, ty: event.translationY }
          );
          absolute.value = { x: event.absoluteX, y: event.absoluteY };
          transform.value = { x: mTx, y: mTy };
        })
        .onEnd(() => {
          runOnJS(handleDragEnd)({
            active: activeNode.value,
            over: overNode.value,
          });
        }),
    [onDragEnd, handleDragEnd]
  );

  const ctx: DndContextType = {
    active,
    dragging,
    over,
    activeNode,
    overNode,
    transform,
    register,
    unregister,
    absolute,
    scrollOffset,
    position,
    draggables,
    droppables,
    droppableRects,
    activeRect,
    panGestureFactory,
  };

  return <DndCtx.Provider value={ctx}>{children}</DndCtx.Provider>;
};
