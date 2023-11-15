import { useRef } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { trpc } from "@features/api/trpc";
import { BottomSheetModal, Icon, Typography } from "@features/ui/components";
import { BottomSheetActions } from "@features/ui/components/bottom-sheet-actions";
import { BottomSheetModalType } from "@features/ui/components/bottom-sheet-modal";
import { colors } from "@features/ui/theme";

import { TemplateType } from "../../../types/template";

export const TemplateTraining = ({ template }: { template: TemplateType }) => {
  const utils = trpc.useUtils();
  const { navigate } = useNavigation();
  const bottomSheet = useRef<BottomSheetModalType>(null);

  const { mutate: deleteTemplate } = trpc.training.deleteTemplate.useMutation({
    onSuccess: () => {
      utils.training.getTemplates.invalidate();
    },
  });

  return (
    <>
      <View className="ml-8 flex flex-row items-center p-2">
        <View className="mr-2">
          <Icon size="lg" color={colors.primary} name="reorder-three-outline" />
        </View>
        <Typography
          className="mr-auto text-lg"
          onPress={() => bottomSheet.current?.present()}
        >
          {template.name}
        </Typography>
        <Icon
          onPress={() => bottomSheet.current?.present()}
          color="white"
          name="ellipsis-horizontal-outline"
        />
      </View>

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
              onPress: () => {
                // TODO
              },
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
    </>
  );
};
