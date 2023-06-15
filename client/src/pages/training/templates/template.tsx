import {
  Button,
  Icon,
  Paper,
  Typography,
  BottomSheetModal,
  Divider,
} from "@components/common";
import { BottomSheetModalType } from "@components/common/bottom-sheet-modal";
import { colors } from "@constants/theme";
import { useNavigation } from "@react-navigation/native";
import { trpc } from "@utils/trpc";
import { useRef } from "react";
import { View } from "react-native";
import { TemplateType } from "./types";

export const Template = ({ template }: { template: TemplateType }) => {
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
        <Button
          className="justify-start bg-transparent mb-2"
          beforeIcon={<Icon color={colors.primary} name="create-outline" />}
          onPress={() => {
            navigate("training", { templateId: template.id });
            bottomSheet.current?.close();
          }}
        >
          Edit
        </Button>
        <Divider className="my-1" />
        <Button
          beforeIcon={<Icon color={colors.primary} name="checkbox-outline" />}
          className="justify-start bg-transparent"
        >
          Make current routine
        </Button>
        <Divider className="my-1" />
        <Button
          onPress={() => {
            deleteTemplate({ id: template.id });
            bottomSheet.current?.close();
          }}
          className="justify-start bg-transparent"
          beforeIcon={<Icon color={colors.danger} name="trash-outline" />}
        >
          Delete
        </Button>
      </BottomSheetModal>

      {
        // <Popover
        //   style={floatingStyles}
        //   ref={refs.setFloating}
        //   visible={open}
        //   showOverlay
        //   onDismiss={() => setOpen(false)}
        // >
        //   <View className="bg-base-700 rounded-lg gap-y-1">
        //     <Button
        //       className="justify-start bg-transparent"
        //       beforeIcon={<Icon color={colors.primary} name="create-outline" />}
        //       onPress={() => {
        //         navigate("training", { template });
        //         setOpen(false);
        //       }}
        //     >
        //       Edit
        //     </Button>
        //     <Button
        //       beforeIcon={<Icon color={colors.primary} name="checkbox-outline" />}
        //       className="justify-start bg-transparent"
        //     >
        //       Make current routine
        //     </Button>
        //     <Button
        //       onPress={() => {
        //         deleteTemplate({ id: template.id });
        //         setOpen(false);
        //       }}
        //       className="justify-start bg-transparent"
        //       beforeIcon={<Icon color={colors.danger} name="trash-outline" />}
        //     >
        //       Delete
        //     </Button>
        //   </View>
        // </Popover>
      }
    </Paper>
  );
};
