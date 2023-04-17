import { useEffect, useMemo, useState } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useDndContext } from "./DndContext";

import { NodeId } from "./types";

const createStyles = ({ tx, ty }: { tx: number; ty: number }): ViewStyle => {
  "worklet";
  return {
    transform: [{ translateX: tx }, { translateY: ty }],
  };
};

export const useDraggable = (id: NodeId) => {
  const ref = useAnimatedRef<Animated.View>();
  const { active, register, unregister, panGestureFactory, tx, ty } =
    useDndContext();
  const [isDragging, setIsDragging] = useState(false);

  useAnimatedReaction(
    () => active.value,
    (active) => runOnJS(setIsDragging)(active === id),
    [id]
  );

  const style = useAnimatedStyle(() => ({}), [id]);

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
