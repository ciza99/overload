import { useMemo, useState } from "react";
import { View } from "react-native";
import clsx from "clsx";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

import { DialogProps } from "@features/core/hooks/use-store";
import { Button, Icon, Typography } from "@features/ui/components";
import {
  arrayMove,
  DndContext,
  restrictToYAxis,
  ScrollContainer,
  SortableContext,
  useSortable,
} from "@features/ui/components/dnd";
import { OnDragEndFnc } from "@features/ui/components/dnd/DndContext";
import { NodeId } from "@features/ui/components/dnd/types";
import { colors } from "@features/ui/theme";

export type ReorderDialogProps<TItem> = {
  items: TItem[];
  extractId: (item: TItem) => NodeId;
  extractLabel: (item: TItem) => string;
  onDone?: (items: TItem[]) => void;
  onSwap?: OnDragEndFnc;
};

export const ReorderDialog = <TItem,>({
  items: initialItems,
  extractLabel,
  onDone,
  onSwap,
  close,
  extractId,
}: DialogProps<ReorderDialogProps<TItem>>) => {
  const [items, setItems] = useState(initialItems);
  const itemIds = useMemo(() => items.map(extractId), [items, extractId]);

  return (
    <DndContext
      modifiers={[restrictToYAxis]}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;

        const activeIndex = items.findIndex(
          (item) => extractId(item) === active.id
        );
        const overIndex = items.findIndex(
          (item) => extractId(item) === over.id
        );

        if (activeIndex === -1 || overIndex === -1) return;
        setItems(arrayMove(items, activeIndex, overIndex));
        onSwap?.({ active, over });
      }}
    >
      <View className="w-full">
        <SortableContext items={itemIds}>
          <ScrollContainer>
            {items.map((item) => (
              <Item
                key={extractId(item)}
                id={extractId(item)}
                label={extractLabel(item)}
              />
            ))}
          </ScrollContainer>
          <Button
            className="mt-4"
            beforeIcon={<Icon name="checkmark-done-outline" />}
            onPress={() => {
              onDone?.(items);
              close();
            }}
          >
            Done
          </Button>
        </SortableContext>
      </View>
    </DndContext>
  );
};

const Item = ({ id, label }: { id: NodeId; label: string }) => {
  const { ref, style, panGesture, isDragging } = useSortable(id);
  const transition = useDerivedValue(
    () => withSpring(isDragging ? 1 : 0),
    [isDragging]
  );

  const itemStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(transition.value, [0, 1], [1, 1.1]) }],
    };
  }, []);

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        transition.value,
        [0, 1],
        ["#ffffff", colors.primary]
      ),
    };
  }, []);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        ref={ref}
        style={[style, itemStyle]}
        className={clsx(
          "mr-auto flex flex-row items-center py-1",
          isDragging && "z-10"
        )}
      >
        <Animated.Text style={textStyle}>
          <Icon name="reorder-three-outline" />
        </Animated.Text>
        <Typography weight="bold" className="px-2 text-lg">
          {label}
        </Typography>
      </Animated.View>
    </GestureDetector>
  );
};
