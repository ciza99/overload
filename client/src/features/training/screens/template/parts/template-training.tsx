import { useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { trpc } from "@features/api/trpc";
import {
  BottomSheetModal,
  Icon,
  toast,
  Typography,
} from "@features/ui/components";
import { BottomSheetActions } from "@features/ui/components/bottom-sheet-actions";
import { BottomSheetModalType } from "@features/ui/components/bottom-sheet-modal";
import { useSortable } from "@features/ui/components/dnd";
import { colors } from "@features/ui/theme";

import { TemplateGroupType } from "../../../types/template";

export const TemplateTraining = ({
  template,
}: {
  template: TemplateGroupType["templates"][number];
}) => {
  const { ref, style, isDragging, panGesture } = useSortable(template.id);
  const utils = trpc.useUtils();
  const { navigate } = useNavigation();
  const bottomSheet = useRef<BottomSheetModalType>(null);

  const { mutate: deleteTemplate } = trpc.training.deleteTemplate.useMutation({
    onSuccess: () => {
      utils.training.getGroupedTemplates.invalidate();
    },
    onSettled: () => bottomSheet.current?.close(),
  });

  const { mutate: selectRoutine } = trpc.routine.selectRoutine.useMutation({
    onSuccess: () => {
      utils.routine.getRoutine.invalidate();
    },
    onError: (error) => {
      toast.show({
        type: "error",
        text1: error.message ?? "Something went wrong",
      });
    },
    onSettled: () => bottomSheet.current?.close(),
  });

  const itemStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        isDragging ? colors.base[600] : "rgba(0,0,0,0)"
      ),
    };
  }, [isDragging]);

  return (
    <>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[style, itemStyle]}
          className="ml-8 flex flex-row items-center rounded-lg p-2"
        >
          <Animated.View className="mr-2" ref={ref}>
            <Icon
              size="lg"
              color={colors.primary}
              name="reorder-three-outline"
            />
          </Animated.View>
          <Typography
            className="mr-auto text-lg"
            onPress={() => navigate("training", { templateId: template.id })}
          >
            {template.name}
          </Typography>
          <Icon
            onPress={() => bottomSheet.current?.present()}
            color="white"
            name="ellipsis-horizontal-outline"
          />
        </Animated.View>
      </GestureDetector>

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
              onPress: () => selectRoutine({ templateId: template.id }),
            },
            {
              label: "Delete",
              icon: <Icon color={colors.danger} name="trash-outline" />,
              onPress: () => deleteTemplate({ id: template.id }),
            },
          ]}
        />
      </BottomSheetModal>
    </>
  );
};
