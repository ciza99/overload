import { Button, Icon, Typography } from "@components/common";
import {
  arrayMove,
  DndContext,
  restrictToYAxis,
  SortableContext,
  useSortable,
} from "@components/common/dnd";
import { ScrollContainer } from "@components/common/dnd";
import { NodeId } from "@components/common/dnd/types";
import { DialogProps } from "@components/store/use-store";
import { colors } from "@constants/theme";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

export type ReorderDialogProps<TItem> = {
  items: TItem[];
  extractId: (item: TItem) => NodeId;
  extractLabel: (item: TItem) => string;
  onDone: (items: TItem[]) => void;
};

export const ReorderDialog = <TItem,>({
  items: initialItems,
  extractLabel,
  onDone,
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
              onDone(items);
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
  const { refs, style, panGesture, isDragging } = useSortable(id);
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
        ref={refs.droppable}
        style={style}
        className={clsx(
          "flex flex-row items-center mr-auto py-1",
          isDragging && "z-10"
        )}
      >
        <Animated.View
          ref={refs.draggable}
          className="flex flex-row items-center"
          style={itemStyle}
        >
          <Animated.Text style={textStyle}>
            <Icon name="reorder-three-outline" />
          </Animated.Text>
          <Typography weight="bold" className="px-2 text-lg">
            {label}
          </Typography>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
