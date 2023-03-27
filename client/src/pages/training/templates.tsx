import { View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useStore } from "@components/store/use-store";
import { Typography, Button } from "@components/common";
import { trpc } from "@utils/trpc";
import { CreateGroupDialog } from "@components/dialog/create-group-dialog";

export const Templates = () => {
  const { data } = trpc.training.getTemplates.useQuery();
  const open = useStore((state) => state.dialog.open);

  return (
    <View className="p-4 gap-y-2">
      {data?.map((templateGroup) => (
        <View key={templateGroup.id}>
          <View className="flex flex-row items-center gap-2">
            <Typography className="text-primary">
              <Ionicons size={24} name="reorder-three-outline" />
            </Typography>
            <Typography className="mr-auto text-lg" weight="bold">
              {templateGroup.name}
            </Typography>
            <Ionicons color="white" size={24} name="chevron-down" />
          </View>

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
  );
};
