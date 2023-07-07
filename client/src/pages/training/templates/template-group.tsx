import { RefObject, useState } from "react";
import { Pressable, View } from "react-native";
import {
  Collapsable,
  Icon,
  Typography,
  Button,
  BottomSheetModalType,
} from "@components/common";
import { useStore } from "@components/store/use-store";
import { useSortable } from "@components/common/dnd";
import { trpc } from "@utils/trpc";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { TemplateTraining } from "./template-training";
import { TemplateGroupType } from "./types";
import { colors } from "@constants/theme";
import { CreateTemplateDialog } from "@components/dialog/create-template-dialog";
import { toast } from "@components/common/toast";
import {
  ReorderDialog,
  ReorderDialogProps,
} from "@components/dialog/reorder-dialog";

export const TemplateGroup = ({
  group,
  groupBottomSheetActions,
}: {
  group: TemplateGroupType;
  groupBottomSheetActions: RefObject<BottomSheetModalType>;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const open = useStore((state) => state.dialog.open);
  const utils = trpc.useContext();
  const { mutate: deleteTemplateGroup } =
    trpc.training.deleteTemplateGroup.useMutation({
      onSuccess: () => {
        utils.training.getTemplates.invalidate();
      },
      onError: () => {
        toast.show({
          type: "error",
          text1: "Failed to remove group",
        });
      },
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
    <View className="mb-5">
      <View className="flex flex-row items-center p-2">
        <Pressable
          className="flex flex-row items-center grow"
          onPress={() => setCollapsed((prev) => !prev)}
        >
          <Animated.View style={chevronStyle} className="mr-2">
            <Icon color="white" name="chevron-forward-outline" />
          </Animated.View>
          <Typography className="text-lg" weight="bold">
            {group.name}
          </Typography>
        </Pressable>
        <Icon
          color="white"
          name="ellipsis-horizontal-outline"
          onPress={() => groupBottomSheetActions.current?.present(group.id)}
        />
      </View>
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
          <TemplateTraining key={template.id} template={template} />
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
    </View>
  );
};
