import { ScrollView, View } from "react-native";

import { useStore } from "@components/store/use-store";
import {
  Typography,
  Button,
  Collapsable,
  Icon,
  TextField,
} from "@components/common";
import { AppRouter, trpc } from "@utils/trpc";
import { CreateGroupDialog } from "@components/dialog/create-group-dialog";
import Animated from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import {
  DndContext,
  useSortable,
  SortableContext,
  arrayMove,
  restrictToYAxis,
} from "@components/common/dnd";
import { useMemo, useState } from "react";
import { inferRouterOutputs } from "@trpc/server";
import { Formik } from "formik";

export const Templates = () => {
  const utils = trpc.useContext();
  const { data } = trpc.training.getTemplates.useQuery();
  const open = useStore((state) => state.dialog.open);

  const items = useMemo(() => data?.map(({ id }) => id) ?? [], [data]);

  return (
    <ScrollView>
      <DndContext
        modifiers={[restrictToYAxis]}
        onDragEnd={({ active, over }) => {
          const activeIndex = items.findIndex((id) => active.id === id);
          const overIndex = items.findIndex((id) => over?.id === id);

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
        <SortableContext items={items}>
          <View className="p-4">
            <Typography weight="bold" className="text-2xl mb-5">
              Trainings
            </Typography>
            <Formik initialValues={{}} onSubmit={() => {}}>
              <TextField
                name="search"
                placeholder="search"
                className="mb-5"
                rightContent={
                  <Typography className="text-white">
                    <Icon name="search" />
                  </Typography>
                }
              />
            </Formik>
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
        </SortableContext>
      </DndContext>
    </ScrollView>
  );
};

export const Item = ({
  group,
}: {
  group: inferRouterOutputs<AppRouter>["training"]["getTemplates"][number];
}) => {
  const [open, setOpen] = useState(false);
  const { panGesture, draggableRef, droppableRef, style } = useSortable(
    group.id
  );

  return (
    <Animated.View ref={draggableRef} style={style} className="mb-5">
      <Animated.View ref={droppableRef}>
        <View className="flex flex-row items-center gap-2 p-2">
          <GestureDetector gesture={panGesture}>
            <Typography className="text-primary">
              <Icon name="reorder-three-outline" />
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
          {group.templates.map((template) => (
            <View className="flex flex-row">
              <Icon name="reorder-three-outline" />
              <Typography>{template.name}</Typography>
              <Icon name="ellipsis-horizontal-outline" />
            </View>
          ))}
          <View className="flex flex-row">
            <Button
              className="grow mr-2"
              variant="outlined"
              beforeIcon={<Icon color="white" name="add" />}
            >
              Add training
            </Button>
            <Button
              className="grow bg-danger ml-2"
              beforeIcon={<Icon color="white" name="trash-outline" />}
            >
              Delete group
            </Button>
          </View>
        </Collapsable>
      </Animated.View>
    </Animated.View>
  );
};
