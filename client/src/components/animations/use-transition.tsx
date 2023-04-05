import { useEffect, useState } from "react";
import {
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export const useTransition = <TItem,>(item: TItem) => {
  const [persisted, setPersisted] = useState<TItem | null>(item);

  const progress = useSharedValue(0);

  useEffect(() => {
    runOnUI(() => {
      "worklet";
      progress.value = withSpring(0, {}, () => {
        runOnJS(setPersisted)(item);
        progress.value = withSpring(1);
      });
    })();
  }, [item]);

  useAnimatedReaction(
    () => progress.value,
    (v) => console.log({ v })
  );

  return { persisted };
};
