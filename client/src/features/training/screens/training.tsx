import { RefObject, useMemo, useRef } from "react";
import { View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import clsx from "clsx";
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
  TextButton,
  toast,
  Typography,
} from "@features/ui/components";
import { BottomSheetActions } from "@features/ui/components/bottom-sheet-actions";
import { BottomSheetModalType } from "@features/ui/components/bottom-sheet-modal";
import {
  arrayMove,
  DndContext,
  restrictToYAxis,
  ScrollContainer,
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
  const utils = trpc.useUtils();
  const { data: exercises } = trpc.training.getExercises.useQuery();
  const {
    params: { templateId },
  } = useRoute<Props["route"]>();
  const { data: template } = trpc.training.getTemplate.useQuery({
    id: templateId,
  });

  const { navigate } = useNavigation();
  const bottomSheet = useRef<BottomSheetModalType>(null);
  const startSession = useStore((state) => state.session.startSession);
  const { mutateAsync: swapSessions } =
    trpc.training.dragSwapSession.useMutation({
      onSuccess: (_, { fromId, toId }) => {
        if (!template) return;

        const fromIndex = template.sessions.findIndex(
          ({ id }) => id === fromId
        );
        const toIndex = template.sessions.findIndex(({ id }) => id === toId);
        const newSessions = arrayMove(template.sessions, fromIndex, toIndex);

        utils.training.getTemplate.setData(
          { id: templateId },
          { ...template, sessions: newSessions }
        );
        utils.training.getTemplate.invalidate();
      },
    });

  const { mutate: deleteSession } = trpc.training.deleteSession.useMutation({
    onSuccess: () => {
      utils.training.getTemplate.invalidate({ id: templateId });
    },
    onError: () => {
      toast.show({ type: "error", text1: "Something went wrong" });
    },
  });

  const items = useMemo(
    () => template?.sessions.map(({ id }) => id) ?? [],
    [template]
  );

  if (!template || !exercises) return null;

  return (
    <>
      <DndContext
        modifiers={[restrictToYAxis]}
        onDragEnd={async ({ active, over }) => {
          if (!over || active.id === over.id) return;

          await swapSessions({
            fromId: active.id as number,
            toId: over.id as number,
          });
        }}
      >
        <ScrollContainer className="p-4 pb-24">
          <View className="mb-4 flex flex-row items-center justify-between">
            <Typography weight="bold" className="text-2xl">
              {template.name}
            </Typography>
            <Icon color="white" name="ellipsis-horizontal-outline" />
          </View>
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
          <SortableContext items={items}>
            {template.sessions.map((session) => (
              <TrainingSession
                key={session.id}
                session={session}
                bottomSheetRef={bottomSheet}
              />
            ))}
          </SortableContext>
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
            The training pattern will repeat every {template.sessions.length}{" "}
            days
          </Typography>
        </ScrollContainer>
      </DndContext>

      <BottomSheetModal ref={bottomSheet} snapPoints={["50%"]}>
        {({ data }: { data: SessionType }) => {
          return (
            <BottomSheetActions
              actions={[
                ...(!data.isRest
                  ? [
                      {
                        label: "Edit",
                        icon: (
                          <Icon color={colors.primary} name="create-outline" />
                        ),
                        onPress: () => {
                          navigate("session", { session: { ...data } });
                          bottomSheet.current?.close();
                        },
                      },
                      {
                        label: "Start session",
                        icon: (
                          <Icon
                            color={colors.primary}
                            name="caret-forward-outline"
                          />
                        ),
                        onPress: () => {
                          startSession({
                            startedAt: new Date(),
                            templateId: template.id,
                            initialFormValues: sessionToFormValues(
                              data,
                              exercises
                            ),
                          });
                          bottomSheet.current?.close();
                        },
                      },
                    ]
                  : []),
                {
                  label: "Delete",
                  icon: <Icon color={colors.danger} name="trash-outline" />,
                  onPress: () => {
                    deleteSession({ id: data.id });
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
  const { navigate } = useNavigation();
  const { refs, style, panGesture } = useSortable(session.id);

  const isRest = session.isRest;

  console.log({ session });
  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View ref={refs.droppable} style={style}>
        <Animated.View ref={refs.draggable}>
          <Paper
            className={clsx(
              "mb-2 flex flex-row items-center p-2",
              isRest && "border-2 border-dashed border-base-400 bg-base-800"
            )}
          >
            <View className="mr-2">
              <Icon color="white" name="reorder-three-outline" />
            </View>
            <TextButton
              className={clsx(
                "mr-auto text-lg text-white",
                isRest && "text-base-300"
              )}
              onPress={() => navigate("session", { session })}
            >
              {isRest ? "Rest day" : session.name}
            </TextButton>
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
