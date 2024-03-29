import { useRef } from "react";
import { ScrollView, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import clsx from "clsx";
import { useForm } from "react-hook-form";

import {
  ReorderDialog,
  ReorderDialogProps,
} from "@features/core/components/reorder-dialog";
import { useStore } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import {
  BottomSheetModal,
  BottomSheetModalType,
  Button,
  Icon,
  Paper,
  TextButton,
  toast,
  Typography,
} from "@features/ui/components";
import { BottomSheetActions } from "@features/ui/components/bottom-sheet-actions";
import { colors } from "@features/ui/theme";

import { CreateGroupDialog } from "../../components/create-group-dialog";
import { TemplateGroupType } from "../../types/template";
import { TemplateGroup } from "./parts/template-group";

export const Templates = () => {
  const utils = trpc.useUtils();
  const { navigate } = useNavigation();
  const { data: templateGroups } = trpc.training.getGroupedTemplates.useQuery();
  const { data: routine } = trpc.routine.getRoutine.useQuery();
  useFocusEffect(() => {
    utils.training.getGroupedTemplates.invalidate();
    utils.routine.getRoutine.invalidate();
  });
  const open = useStore((state) => state.dialog.open);
  const groupBottomSheetActions = useRef<BottomSheetModalType>(null);

  const { mutate: swapTemplateGroups } =
    trpc.training.dragSwapTemplateGroup.useMutation();

  const { mutate: deleteTemplateGroup } =
    trpc.training.deleteTemplateGroup.useMutation({
      onSuccess: () => {
        utils.training.getGroupedTemplates.invalidate();
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
          <Paper className="mb-8 p-3">
            <Typography className="mb-2 text-base" weight="semibold">
              Curent training plan:
            </Typography>
            <View className="flex flex-row justify-between">
              <Typography>{routine?.template?.name ?? "-"}</Typography>
              <TextButton
                disabled={!routine}
                className={clsx(!routine && "text-base-400")}
                onPress={() =>
                  routine &&
                  navigate("training", { templateId: routine.templateId })
                }
              >
                Edit
              </TextButton>
            </View>
          </Paper>
          <Typography weight="bold" className="mb-5 text-2xl">
            Trainings
          </Typography>
          {
            // TODO: implement search
            //   <TextField
            //     name="search"
            //     placeholder="search"
            //     className="mb-5"
            //     rightContent={<Icon color="white" name="search" />}
            //     control={control}
            //   />
          }
          {templateGroups?.length === 0 && (
            <View className="mb-5 rounded-lg bg-base-700 px-2 py-8">
              <Typography className="text-center text-lg text-base-300">
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
                    title: "Reorder groups",
                    props: {
                      items: templateGroups,
                      extractId: (item) => item.id,
                      extractLabel: (item) => item.name,
                      onSwap: ({ active, over }) => {
                        if (!over) return;
                        swapTemplateGroups({
                          fromId: active.id as number,
                          toId: over.id as number,
                        });
                      },
                      onDone: () => {
                        utils.training.getGroupedTemplates.invalidate();
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
