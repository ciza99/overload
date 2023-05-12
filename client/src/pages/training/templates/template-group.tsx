import { useState } from "react";
import { View } from "react-native";
import {
  Collapsable,
  Icon,
  Paper,
  Typography,
  Button,
} from "@components/common";
import { useStore } from "@components/store/use-store";
import { useSortable } from "@components/common/dnd";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter, trpc } from "@utils/trpc";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Template } from "./template";
import { TemplateGroupType } from "./types";
import { colors } from "@constants/theme";
import { CreateTemplateDialog } from "@components/dialog/create-template-dialog";

export const TemplateGroup = ({ group }: { group: TemplateGroupType }) => {
  const [collapsed, setCollapsed] = useState(true);
  const open = useStore((state) => state.dialog.open);
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

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withSpring(`${collapsed ? 180 : 0}deg`, {
          mass: 0.5,
          stiffness: 75,
        }),
      },
    ],
  }));

  return (
    <Animated.View ref={draggableRef} style={style} className="mb-5">
      <Animated.View
        ref={droppableRef}
        className="flex flex-row items-center gap-x-2 p-2"
      >
        <View>
          <GestureDetector gesture={panGesture}>
            <Icon
              color={colors.primary}
              size="lg"
              name="reorder-three-outline"
            />
          </GestureDetector>
        </View>
        <Typography className="mr-auto text-lg" weight="bold">
          {group.name}
        </Typography>
        <Animated.View style={chevronStyle}>
          <Icon
            color="white"
            name="chevron-down"
            onPress={() => setCollapsed((prev) => !prev)}
          />
        </Animated.View>
      </Animated.View>
      <Collapsable open={!collapsed}>
        {group.templates.length === 0 && (
          <View className="p-2 bg-base-700 rounded-lg mb-5">
            <Typography
              weight="bold"
              className="text-base-300 text-center text-lg"
            >
              No templates
            </Typography>
          </View>
        )}
        {group.templates.map((template) => (
          <Template key={template.id} template={template} />
        ))}
        <View className="flex flex-row">
          <Button
            className="grow mr-2"
            variant="outlined"
            beforeIcon={<Icon color="white" name="add" />}
            onPress={() =>
              open({
                Component: CreateTemplateDialog,
                props: {
                  templateGroupId: group.id,
                },
                title: "Create template",
              })
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
  );
};
