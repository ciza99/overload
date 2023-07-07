import { BottomSheetActions } from "@components/bottom-sheet-actions";
import {
  BottomSheetModal,
  Button,
  Icon,
  Paper,
  Typography,
} from "@components/common";
import { BottomSheetModalType } from "@components/common/bottom-sheet-modal";
import { CreateSessionDialog } from "@components/dialog/create-session-dialog";
import { useStore } from "@components/store/use-store";
import { colors } from "@constants/theme";
import { NavigationParamMap } from "@pages";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { trpc } from "@utils/trpc";
import { RefObject, useRef } from "react";
import { View } from "react-native";
import { SessionType } from "./session/types";

type Props = NativeStackScreenProps<NavigationParamMap, "training">;

export const Training = () => {
  const open = useStore((state) => state.dialog.open);
  const { data: group } = trpc.training.getTemplates.useQuery();
  const {
    params: { templateId },
  } = useRoute<Props["route"]>();

  const { navigate } = useNavigation();
  const bottomSheet = useRef<BottomSheetModalType>(null);

  const template = group
    ?.map((g) => g.templates)
    .flat()
    .find((t) => t.id === templateId);

  if (!template) return null;

  return (
    <>
      <View className="p-4">
        <View className="flex flex-row items-center justify-between">
          <Typography weight="bold" className="text-2xl">
            {template.name}
          </Typography>
          <Icon name="ellipsis-horizontal-outline" />
        </View>
        <Typography weight="bold" className="text-lg mb-2">
          Sessions:
        </Typography>
        {template.sessions.length === 0 && (
          <Paper className="p-3">
            <Typography
              weight="bold"
              className="text-lg text-center text-base-300"
            >
              No sessions yet
            </Typography>
          </Paper>
        )}
        {template.sessions.map((session) => (
          <TrainingSession
            key={session.id}
            session={session}
            bottomSheetRef={bottomSheet}
          />
        ))}
        <Button
          variant="outlined"
          beforeIcon={<Icon name="add-outline" />}
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
        <Typography className="text-center pt-2">
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
                  onPress: () => {},
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
  return (
    <>
      <Paper className="p-3 flex flex-row items-center mb-2">
        <View className="mr-2">
          <Icon name="reorder-three-outline" />
        </View>
        <Typography weight="bold" className="text-lg mr-auto">
          {session.name}
        </Typography>
        <Icon
          onPress={() => bottomSheetRef.current?.present(session)}
          name="ellipsis-horizontal-outline"
        />
      </Paper>
    </>
  );
};
