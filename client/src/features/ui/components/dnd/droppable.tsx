import { useEffect, useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
} from "react-native-reanimated";

import { useDndContext } from "./DndContext";
import { NodeId } from "./types";

export const useDroppable = (id: NodeId) => {
  const ref = useAnimatedRef<Animated.View>();
  const { register, unregister, over } = useDndContext();
  const [isOver, setIsOver] = useState(false);

  useAnimatedReaction(
    () => over.value,
    (overId) => runOnJS(setIsOver)(id === overId),
    [id]
  );

  useEffect(() => {
    register(id, "droppable", ref);

    return () => {
      unregister(id, "droppable");
    };
  }, [id, ref, register, unregister]);

  return {
    isOver,
    over,
    ref,
  };
};
