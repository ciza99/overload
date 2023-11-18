import { RefObject, useMemo, useRef } from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import { NavigationParamMap } from "@features/core/components/router";
import { useStore } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import {
  BottomSheetModal,
  Button,
  Divider,
  Icon,
  Paper,
  Typography,
} from "@features/ui/components";
import { BottomSheetActions } from "@features/ui/components/bottom-sheet-actions";
import { BottomSheetModalType } from "@features/ui/components/bottom-sheet-modal";
import {
  DndContext,
  restrictToYAxis,
  SortableContext,
  useSortable,
} from "@features/ui/components/dnd";
import { colors } from "@features/ui/theme";

import { CreateSessionDialog } from "../components/create-session-dialog";
import { sessionToFormValues } from "../lib/session-to-form-values";
import { SessionType } from "../types/training";

type Props = NativeStackScreenProps<NavigationParamMap, "training">;

export const Training = () => {
  const open = useStore((state) => state.dialog.open);
  const { data: group } = trpc.training.getTemplates.useQuery();
  const { data: exercises } = trpc.training.getExercises.useQuery();
  const {
    params: { templateId },
  } = useRoute<Props["route"]>();

  const { navigate } = useNavigation();
  const bottomSheet = useRef<BottomSheetModalType>(null);
  const startSession = useStore((state) => state.session.startSession);

  const template = useMemo(
    () =>
      group
        ?.map((g) => g.templates)
        .flat()
        .find((t) => t.id === templateId),
    [group, templateId]
  );

  const items = useMemo(
    () => template?.sessions.map(({ id }) => id) ?? [],
    [template]
  );

  if (!template || !exercises) return null;

  return (
    <>
      <View className="p-4">
        <View className="flex flex-row items-center justify-between">
          <Typography weight="bold" className="text-2xl">
            {template.name}
          </Typography>
          <Icon color="white" name="ellipsis-horizontal-outline" />
        </View>
        <Divider className="my-2" />
        <Typography weight="bold" className="mb-2 text-lg">
          Sessions:
        </Typography>
        {template.sessions.length === 0 && (
          <Paper className="p-3">
            <Typography className="text-center text-lg text-base-300">
              No sessions yet
            </Typography>
          </Paper>
        )}
        <DndContext
          modifiers={[restrictToYAxis]}
          onDragEnd={({ active, over }) => {
            if (!over) return;
            console.log({ active, over });
          }}
        >
          <SortableContext items={items}>
            {template.sessions.map((session) => (
              <TrainingSession
                key={session.id}
                session={session}
                bottomSheetRef={bottomSheet}
              />
            ))}
          </SortableContext>
        </DndContext>
        <Button
          className="mt-2"
          variant="outlined"
          beforeIcon={<Icon color="white" name="add-outline" />}
          onPress={() =>
            open({
              Component: CreateSessionDialog,
              title: "Create session",
              props: { templateId: template.id },
            })
          }
        >
          Add session
        </Button>
        <Typography className="pt-2 text-center">
          The training pattern will repeat every {template.sessions.length} days
        </Typography>
      </View>

      <BottomSheetModal ref={bottomSheet} snapPoints={["50%"]}>
        {({ data }: { data: SessionType }) => {
          return (
            <BottomSheetActions
              actions={[
                {
                  label: "Edit",
                  icon: <Icon color={colors.primary} name="create-outline" />,
                  onPress: () => {
                    navigate("session", { session: { ...data } });
                    bottomSheet.current?.close();
                  },
                },
                {
                  label: "Start session",
                  icon: (
                    <Icon color={colors.primary} name="caret-forward-outline" />
                  ),
                  onPress: () => {
                    startSession({
                      startedAt: new Date(),
                      templateId: template.id,
                      initialFormValues: sessionToFormValues(data, exercises),
                    });
                    bottomSheet.current?.close();
                  },
                },
                {
                  label: "Delete",
                  icon: <Icon color={colors.danger} name="trash-outline" />,
                  onPress: () => {
                    bottomSheet.current?.close();
                  },
                },
              ]}
            />
          );
        }}
      </BottomSheetModal>
    </>
  );
};

const TrainingSession = ({
  session,
  bottomSheetRef,
}: {
  session: SessionType;
  bottomSheetRef: RefObject<BottomSheetModalType>;
}) => {
  const { refs, style, panGesture } = useSortable(session.id);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View ref={refs.droppable} style={style}>
        <Animated.View ref={refs.draggable}>
          <Paper className="mb-2 flex flex-row items-center p-2">
            <View className="mr-2">
              <Icon color="white" name="reorder-three-outline" />
            </View>
            <Typography className="mr-auto text-lg">{session.name}</Typography>
            <Icon
              color="white"
              onPress={() => bottomSheetRef.current?.present(session)}
              name="ellipsis-horizontal-outline"
            />
          </Paper>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
