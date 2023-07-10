import { ScrollView, View } from "react-native";
import { useStore } from "@components/store/use-store";
import {
  Typography,
  Button,
  Icon,
  TextField,
  BottomSheetModal,
  BottomSheetModalType,
  toast,
} from "@components/common";
import { trpc } from "@utils/trpc";
import { CreateGroupDialog } from "@components/dialog/create-group-dialog";
import { TemplateGroup } from "./template-group";
import { useForm } from "react-hook-form";
import { BottomSheetActions } from "@components/bottom-sheet-actions";
import {
  ReorderDialog,
  ReorderDialogProps,
} from "@components/dialog/reorder-dialog";
import { useRef } from "react";
import { colors } from "@constants/theme";
import { TemplateGroupType } from "./types";

export const TemplateScreen = () => {
  const utils = trpc.useContext();
  const { data: templateGroups } = trpc.training.getTemplates.useQuery();
  const { control } = useForm({});
  const open = useStore((state) => state.dialog.open);
  const groupBottomSheetActions = useRef<BottomSheetModalType>(null);

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

  if (!templateGroups) return null;

  return (
    <>
      <ScrollView>
        <View className="p-4">
          <Typography weight="bold" className="text-2xl mb-5">
            Trainings
          </Typography>
          <TextField
            name="search"
            placeholder="search"
            className="mb-5"
            rightContent={<Icon color="white" name="search" />}
            control={control}
          />
          {templateGroups?.length === 0 && (
            <View className="px-2 py-8 bg-base-700 rounded-lg mb-5">
              <Typography className="text-base-300 text-center text-lg">
                No template groups
              </Typography>
            </View>
          )}
          {templateGroups?.map((templateGroup) => (
            <TemplateGroup
              key={templateGroup.id}
              group={templateGroup}
              groupBottomSheetActions={groupBottomSheetActions}
            />
          ))}
          <Button
            className="mt-4"
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
      </ScrollView>

      <BottomSheetModal
        snapPoints={["75%", "100%"]}
        ref={groupBottomSheetActions}
      >
        {({ data: groupId }: { data: number }) => (
          <BottomSheetActions
            actions={[
              {
                label: "Reorder groups",
                icon: (
                  <Icon color={colors.primary} name="swap-vertical-outline" />
                ),
                onPress: () => {
                  open<ReorderDialogProps<TemplateGroupType>>({
                    Component: ReorderDialog,
                    props: {
                      items: templateGroups,
                      extractId: (item) => item.id,
                      extractLabel: (item) => item.name,
                      onDone: (items) => {
                        // utils.training.getTemplates.setData(() => items);
                        console.log(items);
                      },
                    },
                  });

                  groupBottomSheetActions.current?.close();
                },
              },
              {
                label: "Delete group",
                icon: <Icon color={colors.danger} name="trash-outline" />,
                onPress: () => {
                  deleteTemplateGroup({ id: groupId });
                  groupBottomSheetActions.current?.close();
                },
              },
            ]}
          />
        )}
      </BottomSheetModal>
    </>
  );
};
