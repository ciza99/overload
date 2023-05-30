import { ScrollView, View } from "react-native";

import { useStore } from "@components/store/use-store";
import { Typography, Button, Icon, TextField } from "@components/common";
import { trpc } from "@utils/trpc";
import { CreateGroupDialog } from "@components/dialog/create-group-dialog";
import {
  DndContext,
  SortableContext,
  arrayMove,
  restrictToYAxis,
} from "@components/common/dnd";
import { useMemo } from "react";
import { TemplateGroup } from "./template-group";
import { useForm } from "react-hook-form";

export const TemplateScreen = () => {
  const utils = trpc.useContext();
  const { data } = trpc.training.getTemplates.useQuery();
  const { control } = useForm({});
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
            <TextField
              name="search"
              placeholder="search"
              className="mb-5"
              rightContent={
                <Typography className="text-white">
                  <Icon name="search" />
                </Typography>
              }
              control={control}
            />
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
