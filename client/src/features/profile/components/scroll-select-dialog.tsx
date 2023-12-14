import { FC } from "react";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { DialogProps } from "@features/core/hooks/use-store";
import { Button, Typography } from "@features/ui/components";
import { NodeId } from "@features/ui/components/dnd/types";

export type ScrollSelectDialog<TItem> = {
  items: TItem[];
  defaultOffset?: number;
  extractId: (item: TItem) => NodeId;
  extractLabel: (item: TItem) => string;
  onDone?: (item: TItem) => void;
};

const ITEM_HEIGHT = 50;

export const ScrollSelectDialog = <TItem,>({
  items,
  extractLabel,
  onDone,
  close,
  extractId,
  defaultOffset = 0,
}: DialogProps<ScrollSelectDialog<TItem>>) => {
  const y = useSharedValue((items.length - 1 - defaultOffset) * ITEM_HEIGHT);
  const previousOffset = useSharedValue(
    (items.length - 1 - defaultOffset) * ITEM_HEIGHT
  );
  const selectedIndex = useDerivedValue(() => {
    return items.length - 1 - Math.round(y.value / ITEM_HEIGHT);
  }, [items.length]);

  const panGesture = Gesture.Pan()
    .onUpdate(({ translationY }) => {
      y.value = interpolate(
        previousOffset.value + translationY,
        [0, (items.length - 1) * ITEM_HEIGHT],
        [0, (items.length - 1) * ITEM_HEIGHT],
        Extrapolate.CLAMP
      );
    })
    .onEnd(() => {
      y.value = withSpring(Math.round(y.value / ITEM_HEIGHT) * ITEM_HEIGHT);
      previousOffset.value = y.value;
    });

  return (
    <View>
      <GestureDetector gesture={panGesture}>
        <View
          style={{ height: 3 * ITEM_HEIGHT }}
          className="justify-center overflow-hidden"
        >
          <View
            style={{ height: ITEM_HEIGHT }}
            className="rounded-lg border border-base-400"
          >
            {items.map((item, index) => (
              <Item
                selectedIndex={selectedIndex}
                id={extractId(item)}
                key={extractId(item)}
                label={extractLabel(item)}
                index={index}
                count={items.length}
                y={y}
              />
            ))}
          </View>
        </View>
      </GestureDetector>
      <Button
        className="mt-4"
        onPress={() => {
          onDone?.(items[selectedIndex.value]);
          close();
        }}
      >
        Done
      </Button>
    </View>
  );
};

const Item: FC<{
  label: string;
  id: NodeId;
  index: number;
  y: SharedValue<number>;
  selectedIndex: SharedValue<number>;
  count: number;
}> = ({ index, label, y, count, selectedIndex }) => {
  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring((-count + index + 1) * ITEM_HEIGHT + y.value),
        },
        { scale: withTiming(selectedIndex.value === index ? 1.15 : 1) },
      ],
      opacity: withTiming(selectedIndex.value === index ? 1 : 0.25),
    };
  }, [index]);

  return (
    <Animated.View
      style={[{ height: ITEM_HEIGHT }, style]}
      className="absolute flex w-full flex-row items-center justify-center"
    >
      <Typography>{label}</Typography>
    </Animated.View>
  );
};
