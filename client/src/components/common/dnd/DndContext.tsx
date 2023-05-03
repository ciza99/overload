import {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useState,
} from "react";
import { unstable_batchedUpdates } from "react-native";
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
const DndCtx = createContext<DndContextType>(undefined as never);
export const useDndContext = () => useContext(DndCtx);

export type DndContextType = {
  active: SharedValue<NodeId | null>;
  dragging: boolean;
  over: SharedValue<NodeId | null>;
  activeNode: Readonly<SharedValue<Draggable | null>>;
  overNode: Readonly<SharedValue<Droppable | null>>;
  tx: SharedValue<number>;
  ty: SharedValue<number>;
  register: RegisterFnc;
  unregister: UnregisterFnc;
  draggables: Record<string, Draggable>;
  droppables: Record<string, Droppable>;
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

  const activeNode = useDerivedValue(
    () => (active.value !== null ? draggables[active.value] : null),
    [draggables]
  );
  const overNode = useDerivedValue(
    () => (over.value !== null ? droppables[over.value] : null),
    [droppables]
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

  const activeRect = useDerivedValue<MeasuredDimensions | null>(() => {
    if (!activeNode.value) return null;
    return measure(activeNode.value.ref);
  });

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
      pageX: activeRect.value.pageX + tx.value,
      pageY: activeRect.value.pageY + ty.value,
    };
    return rectIntersections({
      activeRect: activeRectTranslated,
      droppableRects: droppableRects.value,
    });
  });

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
    () => ({
      active: active.value,
      activeNode: activeNode.value,
      over: over.value,
      overNode: overNode.value,
      activeRect: activeRect.value,
      collisions: collisions.value,
    }),
    (state) => {
      // console.log(state);
    }
  );

  const handleEnd = ({
    active: activeProp,
    over: overProp,
  }: {
    active: Draggable | null;
    over: Droppable | null;
  }) => {
    if (activeProp !== null) {
      onDragEnd?.({ active: activeProp, over: overProp });
    }
    setTimeout(() => {
      active.value = null;
      over.value = null;
      tx.value = 0;
      ty.value = 0;
    });
  };

  const panGestureFactory = (id: NodeId) =>
    Gesture.Pan()
      .onBegin(() => {
        console.log("BEGIN");
        runOnJS(setDragging)(true);
        active.value = id;
      })
      .onUpdate(({ translationX, translationY }) => {
        const { tx: mTx, ty: mTy } = modifiers.value.reduce(
          (prev, modifier) => modifier(prev),
          { tx: translationX, ty: translationY }
        );
        tx.value = mTx;
        ty.value = mTy;
      })
      .onEnd(() => {
        console.log("END");
        runOnJS(handleEnd)({ active: activeNode.value, over: overNode.value });
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
    droppableRects,
    panGestureFactory,
  };

  return <DndCtx.Provider value={ctx}>{children}</DndCtx.Provider>;
};
