import { RefObject, useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { useStore } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import {
  BottomSheetModalType,
  Collapsable,
  Divider,
  Icon,
  Typography,
} from "@features/ui/components";
import {
  DndContext,
  restrictToYAxis,
  SortableContext,
} from "@features/ui/components/dnd";

import { CreateTemplateDialog } from "../../../components/create-template-dialog";
import { TemplateGroupType } from "../../../types/template";
import { TemplateTraining } from "./template-training";

export const TemplateGroup = ({
  group,
  groupBottomSheetActions,
}: {
  group: TemplateGroupType;
  groupBottomSheetActions: RefObject<BottomSheetModalType>;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const open = useStore((state) => state.dialog.open);
  const utils = trpc.useUtils();

  const { mutate: swapTemplates } = trpc.training.dragSwapTemplate.useMutation({
    onSuccess: () => utils.training.getGroupedTemplates.invalidate(),
  });

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withSpring(`${!collapsed ? 90 : 0}deg`, {
          mass: 0.5,
          stiffness: 75,
        }),
      },
    ],
  }));

  return (
    <View>
      <View className="flex flex-row items-center p-2">
        <Pressable
          className="flex grow flex-row items-center"
          onPress={() => setCollapsed((prev) => !prev)}
        >
          <Animated.View style={chevronStyle} className="mr-2">
            <Icon color="white" name="chevron-forward-outline" />
          </Animated.View>
          <Typography className="text-lg" weight="bold">
            {group.name}
          </Typography>
        </Pressable>
        <View className="mr-2">
          <Icon
            color="white"
            name="ellipsis-horizontal-outline"
            onPress={() => groupBottomSheetActions.current?.present(group.id)}
          />
        </View>
        <Icon
          color="white"
          name="add-outline"
          onPress={() =>
            open({
              Component: CreateTemplateDialog,
              props: {
                templateGroupId: group.id,
              },
              title: "Create template",
            })
          }
        />
      </View>

      <DndContext
        modifiers={[restrictToYAxis]}
        onDragEnd={({ active, over }) => {
          if (!over || active.id === over.id) return;
          swapTemplates({
            fromId: active.id as number,
            toId: over.id as number,
          });
        }}
      >
        <SortableContext items={group.templates.map(({ id }) => id)}>
          <Collapsable open={!collapsed}>
            {group.templates.length === 0 && (
              <View className="mb-2 rounded-lg bg-base-700 p-2">
                <Typography className="text-center text-lg text-base-300">
                  No templates
                </Typography>
              </View>
            )}
            {group.templates.map((template) => (
              <TemplateTraining key={template.id} template={template} />
            ))}
          </Collapsable>
        </SortableContext>
      </DndContext>

      <Divider className="my-2" />
    </View>
  );
};
