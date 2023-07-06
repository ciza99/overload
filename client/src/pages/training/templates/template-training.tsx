import { BottomSheetActions } from "@components/bottom-sheet-actions";
import { Icon, Paper, Typography, BottomSheetModal } from "@components/common";
import { BottomSheetModalType } from "@components/common/bottom-sheet-modal";
import { colors } from "@constants/theme";
import { useNavigation } from "@react-navigation/native";
import { trpc } from "@utils/trpc";
import { useRef } from "react";
import { View } from "react-native";
import { TemplateType } from "./types";

export const TemplateTraining = ({ template }: { template: TemplateType }) => {
  const utils = trpc.useContext();
  const { navigate } = useNavigation();
  const bottomSheet = useRef<BottomSheetModalType>(null);

  const { mutate: deleteTemplate } = trpc.training.deleteTemplate.useMutation({
    onSuccess: () => {
      utils.training.getTemplates.invalidate();
    },
  });

  return (
    <Paper className="flex flex-row p-2 items-center mb-3">
      <View className="mr-2">
        <Icon size="lg" color="white" name="reorder-three-outline" />
      </View>
      <Typography weight="bold" className="mr-auto text-lg">
        {template.name}
      </Typography>
      <Icon
        onPress={() => bottomSheet.current?.present()}
        color="white"
        name="ellipsis-horizontal-outline"
      />

      <BottomSheetModal ref={bottomSheet} snapPoints={["50%"]}>
        <BottomSheetActions
          actions={[
            {
              label: "Edit",
              icon: <Icon color={colors.primary} name="create-outline" />,
              onPress: () => {
                navigate("training", { templateId: template.id });
                bottomSheet.current?.close();
              },
            },
            {
              label: "Make current routine",
              icon: <Icon color={colors.primary} name="checkbox-outline" />,
              onPress: () => {},
            },
            {
              label: "Delete",
              icon: <Icon color={colors.danger} name="trash-outline" />,
              onPress: () => {
                deleteTemplate({ id: template.id });
                bottomSheet.current?.close();
              },
            },
          ]}
        />
      </BottomSheetModal>
    </Paper>
  );
};
