import { RefObject, useState } from "react";
import { Pressable, View } from "react-native";
import {
  Collapsable,
  Icon,
  Typography,
  Button,
  BottomSheetModalType,
  Divider,
} from "@components/common";
import { useStore } from "@components/store/use-store";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { TemplateTraining } from "./template-training";
import { TemplateGroupType } from "./types";
import { CreateTemplateDialog } from "@components/dialog/create-template-dialog";

export const TemplateGroup = ({
  group,
  groupBottomSheetActions,
}: {
  group: TemplateGroupType;
  groupBottomSheetActions: RefObject<BottomSheetModalType>;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const open = useStore((state) => state.dialog.open);

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

      <Collapsable open={!collapsed}>
        {group.templates.length === 0 && (
          <View className="p-2 bg-base-700 rounded-lg mb-2">
            <Typography className="text-base-300 text-center text-lg">
              No templates
            </Typography>
          </View>
        )}
        {group.templates.map((template) => (
          <TemplateTraining key={template.id} template={template} />
        ))}
      </Collapsable>

      <Divider className="my-2" />
    </View>
  );
};
