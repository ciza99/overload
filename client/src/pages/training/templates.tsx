import { ScrollView, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@components/store/use-store";
import { Typography, Button } from "@components/common";
import { trpc } from "@utils/trpc";
import { CreateGroupDialog } from "@components/dialog/create-group-dialog";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  withSpring,
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { useState } from "react";
import { useDraggable, DndProvider } from "@components/common/dnd";

export const Templates = () => {
  const { data } = trpc.training.getTemplates.useQuery();
  const open = useStore((state) => state.dialog.open);

  return (
    <ScrollView>
      <DndProvider>
        <View className="p-4 gap-y-2">
          {data?.map((templateGroup) => (
            <View key={templateGroup.id}>
              <Item name={templateGroup.name} id={templateGroup.id} />
              {templateGroup.templates.map((template) => (
                <View className="flex flex-row">
                  <Ionicons size={24} name="reorder-three-outline" />
                  <Typography>{template.name}</Typography>
                  <Ionicons size={24} name="ellipsis-horizontal-outline" />
                </View>
              ))}
            </View>
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
            beforeIcon={<Ionicons size={24} name="add" />}
          >
            Add group
          </Button>
        </View>
      </DndProvider>
    </ScrollView>
  );
};

export const Item = ({ name, id }: { name: string; id: number }) => {
  const { gesture, setRef, onLayout, style } = useDraggable(id);

  return (
    <Animated.View
      className="flex flex-row items-center gap-2"
      onLayout={onLayout}
      ref={setRef}
      style={style}
    >
      <GestureDetector gesture={gesture}>
        <Typography className="text-primary">
          <Ionicons size={34} name="reorder-three-outline" />
        </Typography>
      </GestureDetector>
      <Typography className="mr-auto text-lg" weight="bold">
        {name}
      </Typography>
      <Ionicons color="white" size={24} name="chevron-down" />
    </Animated.View>
  );
};
