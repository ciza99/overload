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
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
  useSharedValue,
  withSpring,
  SharedValue,
} from "react-native-reanimated";
import { Gesture, PanGesture } from "react-native-gesture-handler";

const DndContext = createContext<DndContextType>(undefined as never);
const useDndCtx = () => useContext(DndContext);

type DndContextType = {
  active: Key | null;
  over: Key | null;
  setActive: React.Dispatch<React.SetStateAction<Key | null>>;
  draggables: SharedValue<Record<Key, ClientRect>>;
  droppables: SharedValue<Record<Key, ClientRect>>;
  tx: SharedValue<number>;
  ty: SharedValue<number>;
  createGesture: (key: Key) => PanGesture;
  onDragStart?: () => void;
  onDragUpdate?: () => void;
  onDragEnd?: () => void;
};

type Key = string | number;

type Measure = {
  x: number;
  y: number;
  width: number;
  height: number;
  px: number;
  py: number;
};

export const useDroppable = (id: Key) => {
  const [ref, setRef] = useState<Animated.View | View | null>(null);
  const { droppables, over } = useDndCtx();
  const onLayout = () => {
    ref?.measure((x, y, width, height, px, py) => {
      const measure = { x, y, width, height, px, py };
      droppables.value[id] = calculateRect(measure);
    });
  };

  // useEffect(() => {
  //   return () => {
  //     droppables.value.delete(id);
  //   };
  // }, [id]);

  const isOver = over === id;

  return {
    isOver,
    over,
    onLayout,
    setRef,
  };
};

export const useDraggable = (id: Key) => {
  const [ref, setRef] = useState<Animated.View | View | null>(null);
  const { active, draggables, tx, ty, createGesture } = useDndCtx();

  const style = useAnimatedStyle(() =>
    active === id
      ? {
          transform: [{ translateX: tx.value }, { translateY: ty.value }],
        }
      : {}
  );

  const gesture = useMemo(() => createGesture(id), [id]);

  const onLayout = () => {
    ref?.measure((x, y, width, height, px, py) => {
      const measure = { x, y, width, height, px, py };
      draggables.value[id] = calculateRect(measure);
    });
  };

  // useEffect(() => {
  //   return () => {
  //     draggables.value.delete(id);
  //   };
  // }, [id]);

  return {
    gesture,
    style,
    onLayout,
    setRef,
  };
};

type ClientRect = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

const calculateRect = (measure: Measure): ClientRect => {
  const { x, y, width, height } = measure;
  return {
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    width,
    height,
  };
};

const calculateIntersectionRatio = (source: ClientRect, target: ClientRect) => {
  const left = Math.max(source.left, target.left);
  const right = Math.min(source.right, target.right);
  const top = Math.max(source.top, target.top);
  const bottom = Math.min(source.bottom, target.bottom);

  if (left >= right || top >= bottom) {
    return 0;
  }

  const width = right - left;
  const height = bottom - top;

  const intersectionArea = width * height;
  const sourceArea = source.width * source.height;
  const targetArea = target.width * target.height;

  return intersectionArea / (sourceArea + targetArea - intersectionArea);
};

const calculateIntersections = (
  sourceRect: ClientRect,
  droppables: Record<Key, ClientRect>
) => {
  const entries = [...Object.entries(droppables)];
  const ratios = entries.map(([key, targetRect]) => {
    const ratio = calculateIntersectionRatio(sourceRect, targetRect);
    return { key, ratio };
  });

  return ratios.sort((a, b) => b.ratio - a.ratio);
};

export const DndProvider = ({
  children,
  onDragStart,
  onDragUpdate,
  onDragEnd,
}: {
  children: ReactNode;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragUpdate?: () => void;
}) => {
  const draggables = useSharedValue<Record<Key, ClientRect>>({});
  const droppables = useSharedValue<Record<Key, ClientRect>>({});
  const [active, setActive] = useState<Key | null>(null);
  const [over, setOver] = useState<Key | null>(null);

  console.log({
    over,
    active,
    draggables: draggables.value,
    droppables: droppables.value,
  });

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const createGesture = (id: Key) =>
    Gesture.Pan()
      .enabled(active === null || active === id)
      .onStart((event) => {
        onDragStart?.();
        runOnJS(setActive)(id);
        console.log("Start", { event });
      })
      .onUpdate((event) => {
        onDragUpdate?.();

        tx.value = event.translationX;
        ty.value = event.translationY;

        const draggingRect = active ? draggables.value[id] : null;
        const offsetedRect: ClientRect | null = draggingRect
          ? {
              ...draggingRect,
              top: draggingRect.top + event.translationY,
              right: draggingRect.right + event.translationX,
              bottom: draggingRect.bottom + event.translationY,
              left: draggingRect.left + event.translationX,
            }
          : null;

        // console.log({ offsetedRect, draggables, droppables });

        const intersections = offsetedRect
          ? calculateIntersections(offsetedRect, droppables.value)
          : [];

        console.log({ intersections });

        const over =
          intersections[0]?.ratio === 0 ? null : intersections[0]?.key;
        runOnJS(setOver)(over);
      })
      .onEnd(() => {
        onDragEnd?.();

        tx.value = withSpring(0);
        ty.value = withSpring(0);

        runOnJS(setActive)(null);
        runOnJS(setOver)(null);
      });

  return (
    <DndContext.Provider
      value={{
        active,
        over,
        tx,
        ty,
        createGesture,
        draggables,
        droppables,
        setActive,
        onDragStart,
        onDragUpdate,
        onDragEnd,
      }}
    >
      {children}
    </DndContext.Provider>
  );
};
