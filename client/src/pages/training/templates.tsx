import { ScrollView, View } from "react-native";

import { useStore } from "@components/store/use-store";
import {
  Typography,
  Button,
  Collapsable,
  Icon,
  TextField,
  Paper,
} from "@components/common";
import { AppRouter, trpc } from "@utils/trpc";
import { CreateGroupDialog } from "@components/dialog/create-group-dialog";
import Animated, {
  Layout,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
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
  const utils = trpc.useContext();
  const { panGesture, draggableRef, droppableRef, style } = useSortable(
    group.id
  );
  const { mutate: deleteTemplateGroup } =
    trpc.training.deleteTemplateGroup.useMutation({
      onSuccess: () => {
        utils.training.getTemplates.invalidate();
      },
    });

  const { mutate: createTemplate } = trpc.training.createTemplate.useMutation({
    onSuccess: () => {
      utils.training.getTemplates.invalidate();
    },
  });

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withSpring(`${open ? 180 : 0}deg`, {
          mass: 0.5,
          stiffness: 75,
        }),
      },
    ],
  }));

  return (
    <Animated.View ref={draggableRef} style={style} className="mb-5">
      <Animated.View ref={droppableRef}>
        <Animated.View
          layout={Layout}
          className="flex flex-row items-center gap-2 p-2"
        >
          <View>
            <GestureDetector gesture={panGesture}>
              <Typography className="text-primary">
                <Icon size="lg" name="reorder-three-outline" />
              </Typography>
            </GestureDetector>
          </View>
          <Typography className="mr-auto text-lg" weight="bold">
            {group.name}
          </Typography>
          <Animated.View style={chevronStyle}>
            <Icon
              onPress={() => setOpen((prev) => !prev)}
              color="white"
              name="chevron-down"
            />
          </Animated.View>
        </Animated.View>
        <Collapsable open={open}>
          {group.templates.map((template) => (
            <Paper className="flex flex-row items-center p-2 gap-2 mb-5">
              <Icon size="lg" color="white" name="reorder-three-outline" />
              <Typography weight="bold" className="mr-auto text-lg">
                {template.name}
              </Typography>
              <Icon color="white" name="ellipsis-horizontal-outline" />
            </Paper>
          ))}
          <View className="flex flex-row">
            <Button
              className="grow mr-2"
              variant="outlined"
              beforeIcon={<Icon color="white" name="add" />}
              onPress={() =>
                createTemplate({ templateGroupId: group.id, name: "test" })
              }
            >
              Add template
            </Button>
            <Button
              className="grow bg-danger ml-2"
              beforeIcon={<Icon color="white" name="trash-outline" />}
              onPress={() => deleteTemplateGroup({ id: group.id })}
            >
              Delete group
            </Button>
          </View>
        </Collapsable>
      </Animated.View>
    </Animated.View>
  );
};
