import { useEffect, useMemo, useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

import { useDndContext } from "./DndContext";
import { NodeId } from "./types";

export const useDraggable = (id: NodeId) => {
  const ref = useAnimatedRef<Animated.View>();
  const { active, register, unregister, panGestureFactory, position } =
    useDndContext();
  const [isDragging, setIsDragging] = useState(false);

  useAnimatedReaction(
    () => active.value,
    (active) => runOnJS(setIsDragging)(active === id),
    [id]
  );

  const isActive = useDerivedValue(() => active.value === id, [id]);

  const style = useAnimatedStyle(
    () => ({
      transform: [
        { translateX: isActive.value ? position.value.x : withSpring(0) },
        { translateY: isActive.value ? position.value.y : withSpring(0) },
      ],
    }),
    [id]
  );

  useEffect(() => {
    register(id, "draggable", ref);

    return () => {
      unregister(id, "draggable");
    };
  }, [id]);

  const panGesture = useMemo(
    () => panGestureFactory(id),
    [id, panGestureFactory]
  );

  return {
    active,
    isDragging,
    panGesture,
    style,
    ref,
  };
};
