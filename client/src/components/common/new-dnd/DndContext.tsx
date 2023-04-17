import {
  createContext,
  ReactNode,
  RefObject,
  useContext,
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
} from "react-native-reanimated";
import { rectIntersections } from "./collision-detection";
import { Draggable, Droppable, NodeId, NodeType } from "./types";

const DndCtx = createContext<DndContextType>(undefined as never);
export const useDndContext = () => useContext(DndCtx);

export type DndContextType = {
  active: SharedValue<NodeId | null>;
  dragging: Readonly<SharedValue<boolean>>;
  over: SharedValue<NodeId | null>;
  activeNode: Readonly<SharedValue<Draggable | null>>;
  overNode: Readonly<SharedValue<Droppable | null>>;
  tx: SharedValue<number>;
  ty: SharedValue<number>;
  register: RegisterFnc;
  unregister: UnregisterFnc;
  draggables: Record<string, Draggable>;
  droppables: Record<string, Droppable>;
  panGestureFactory: (id: NodeId) => PanGesture;
};

type RegisterFnc = (
  id: NodeId,
  type: NodeType,
  ref: RefObject<Animated.View>
) => void;
type UnregisterFnc = (id: NodeId, type: NodeType) => void;

export const DndContext = ({ children }: { children: ReactNode }) => {
  const [draggables, setDraggables] = useState<Record<string, Draggable>>({});
  const [droppables, setDroppables] = useState<Record<string, Droppable>>({});

  const active = useSharedValue<NodeId | null>(null);
  const over = useSharedValue<NodeId | null>(null);

  const dragging = useDerivedValue(() => active.value !== null);
  const activeNode = useDerivedValue(() =>
    active.value ? draggables[active.value] : null
  );
  const overNode = useDerivedValue(() =>
    over.value ? droppables[over.value] : null
  );

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const register: RegisterFnc = (id, type, ref) => {
    const setter = type === "draggable" ? setDraggables : setDroppables;
    setter((prev) => ({ ...prev, [id]: { id, ref } }));
  };

  const unregister: UnregisterFnc = (id, type) => {
    const setter = type === "draggable" ? setDraggables : setDroppables;
    setter((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const activeRect = useDerivedValue(() => {
    if (!activeNode.value) return null;
    return measure(activeNode.value.ref);
  });

  const droppableRects = useDerivedValue(() => {
    if (!activeRect.value) return {};

    return Object.entries(droppables).reduce<
      Record<string, MeasuredDimensions>
    >((acc, [key, droppable]) => {
      const measured = measure(droppable.ref);
      if (!measured) return acc;
      return { ...acc, [key]: measured };
    }, {});
  });

  const collisions = useDerivedValue(() => {
    if (!activeRect.value) return [];
    return rectIntersections({
      activeRect: activeRect.value,
      droppableRects: droppableRects.value,
    });
  });

  useAnimatedReaction(
    () => collisions.value,
    (collisions) => {
      const collision = collisions[0] ?? null;
      over.value = droppables[collision.id].id;
    },
    [droppables]
  );

  const panGestureFactory = (id: NodeId) =>
    Gesture.Pan()
      .onBegin(() => {
        active.value = id;
      })
      .onUpdate(({ translationX, translationY }) => {
        tx.value = translationX;
        ty.value = translationY;
      })
      .onEnd(() => {
        active.value = null;
      });

  const ctx: DndContextType = {
    active,
    dragging,
    over,
    activeNode,
    overNode,
    tx,
    ty,
    register,
    unregister,
    draggables,
    droppables,
    panGestureFactory,
  };

  return <DndCtx.Provider value={ctx}>{children}</DndCtx.Provider>;
};
