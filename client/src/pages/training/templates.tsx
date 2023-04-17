import { ScrollView, View } from "react-native";

import { useStore } from "@components/store/use-store";
import { Typography, Button, Collapsable, Icon } from "@components/common";
import { AppRouter, trpc } from "@utils/trpc";
import { CreateGroupDialog } from "@components/dialog/create-group-dialog";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import {
  DndProvider,
  useSortable,
  SortableProvider,
  arrayMove,
} from "@components/common/dnd";
import { useMemo, useState } from "react";
import { restrictToYAxis } from "@components/common/dnd/modifiers";
import { inferRouterOutputs } from "@trpc/server";

export const Templates = () => {
  const utils = trpc.useContext();
  const { data } = trpc.training.getTemplates.useQuery();
  const open = useStore((state) => state.dialog.open);

  const items = useMemo(() => data?.map(({ id }) => id) ?? [], [data]);

  return (
    <ScrollView>
      <DndProvider
        modifiers={[restrictToYAxis]}
        onDragEnd={({ active, over, translate }) => {
          const activeIndex = items.findIndex((id) => Number(active.id) === id);
          const overIndex = items.findIndex((id) => Number(over?.id) === id);

          console.log("DROP", { activeIndex, overIndex, length: data?.length });
          if (
            !data ||
            overIndex === -1 ||
            activeIndex === -1 ||
            activeIndex === overIndex
          ) {
            return;
          }

          utils.training.getTemplates.setData(
            undefined,
            arrayMove(data, activeIndex, overIndex)
          );
        }}
      >
        <SortableProvider items={items}>
          <View className="p-4 gap-y-2">
            {data?.map((templateGroup) => (
              <Item key={templateGroup.id} group={templateGroup} />
            ))}
            <Button
              variant="outlined"
              onPress={() => {
                open({
                  title: "Create Template Group",
                  Component: CreateGroupDialog,
                  props: {},
                });
              }}
              beforeIcon={<Icon name="add" />}
            >
              Add group
            </Button>
          </View>
        </SortableProvider>
      </DndProvider>
    </ScrollView>
  );
};

export const Item = ({
  group,
}: {
  group: inferRouterOutputs<AppRouter>["training"]["getTemplates"][number];
}) => {
  const [open, setOpen] = useState(false);
  const { gesture, draggableRef, droppableRef, style } = useSortable(group.id);

  return (
    <Animated.View ref={draggableRef} style={style}>
      <Animated.View ref={droppableRef}>
        <View className="flex flex-row items-center gap-2">
          <GestureDetector gesture={gesture}>
            <Typography className="text-primary">
              <Icon size="xl" name="reorder-three-outline" />
            </Typography>
          </GestureDetector>
          <Typography className="mr-auto text-lg" weight="bold">
            {group.name}
          </Typography>
          <Icon
            onPress={() => setOpen((prev) => !prev)}
            size="lg"
            color="white"
            name="chevron-down"
          />
        </View>
        <Collapsable open={open}>
          {group.templates.length === 0 && (
            <Button variant="outlined">
              <Icon color="white" name="add" />
            </Button>
          )}
          {group.templates.map((template) => (
            <View className="flex flex-row">
              <Icon name="reorder-three-outline" />
              <Typography>{template.name}</Typography>
              <Icon name="ellipsis-horizontal-outline" />
            </View>
          ))}
        </Collapsable>
      </Animated.View>
    </Animated.View>
  );
};
