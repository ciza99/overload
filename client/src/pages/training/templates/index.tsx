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
import { TemplateGroup } from "./template-group";

export const TemplateScreen = () => {
  const utils = trpc.useContext();
  const { data } = trpc.training.getTemplates.useQuery();
  console.log(JSON.stringify(data, null, 2));
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
            {data?.length === 0 && (
              <View className="p-2 bg-base-700 rounded-lg mb-5">
                <Typography
                  weight="bold"
                  className="text-base-300 text-center text-lg"
                >
                  No template groups
                </Typography>
              </View>
            )}
            {data?.map((templateGroup) => (
              <TemplateGroup key={templateGroup.id} group={templateGroup} />
            ))}
            <Button
              variant="outlined"
              onPress={() => {
                open({
                  title: "Create template group",
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
