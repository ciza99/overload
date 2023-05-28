import { Button, Icon, Paper, Typography } from "@components/common";
import { Popover } from "@components/common/popover";
import { CreateSessionDialog } from "@components/dialog/create-session-dialog";
import { useStore } from "@components/store/use-store";
import { colors } from "@constants/theme";
import { offset, useFloating } from "@floating-ui/react-native";
import { NavigationParamMap } from "@pages";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { trpc } from "@utils/trpc";
import { useState } from "react";
import { View } from "react-native";
import { TemplateType, TrainingType } from "./types";

type Props = NativeStackScreenProps<NavigationParamMap, "training">;

export const Sessions = () => {
  const open = useStore((state) => state.dialog.open);
  const { data: templates } = trpc.training.getTemplates.useQuery();
  const {
    params: { templateId },
  } = useRoute<Props["route"]>();

  const template = templates?.find((t) => t.id === templateId);

  if (!template) return null;

  return (
    <View className="p-4 gap-y-2">
      <View className="flex flex-row items-center justify-between">
        <Typography weight="bold" className="text-2xl">
          {template.name}
        </Typography>
        <Icon name="ellipsis-horizontal-outline" />
      </View>
      <Typography weight="bold" className="text-lg mb-2">
        Sessions:
      </Typography>
      {template.trainings.length === 0 && (
        <Paper className="p-3">
          <Typography
            weight="bold"
            className="text-lg text-center text-base-300"
          >
            No sessions yet
          </Typography>
        </Paper>
      )}
      {template.trainings.map((training) => (
        <Session key={training.order} session={training} />
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
        The training pattern will repeat every {template.trainings.length} days
      </Typography>
    </View>
  );
};

const Session = ({ session }: { session: TrainingType }) => {
  const { navigate } = useNavigation();
  const { floatingStyles, refs, scrollProps } = useFloating({
    sameScrollView: false,
    placement: "bottom-end",
    middleware: [
      offset(({ rects }) => {
        return -rects.reference.height;
      }),
    ],
  });
  const [open, setOpen] = useState(false);

  return (
    <Paper className="p-3 flex flex-row gap-x-2 items-center mb-2">
      <Icon name="reorder-three-outline" />
      <Typography weight="bold" className="text-lg mr-auto">
        {session.name}
      </Typography>
      <View ref={refs.setReference}>
        <Icon
          onPress={() => setOpen(true)}
          name="ellipsis-horizontal-outline"
        />
      </View>

      <Popover
        visible={open}
        ref={refs.setFloating}
        showOverlay
        style={floatingStyles}
        onDismiss={() => setOpen(false)}
      >
        <View className="bg-base-700 rounded-lg gap-y-1">
          <Button
            className="justify-start bg-transparent"
            beforeIcon={<Icon color={colors.primary} name="create-outline" />}
            onPress={() => {
              navigate("session", { session });
              setOpen(false);
            }}
          >
            Edit
          </Button>
          <Button
            beforeIcon={
              <Icon color={colors.primary} name="caret-forward-outline" />
            }
            className="justify-start bg-transparent"
          >
            Start session
          </Button>
          <Button
            onPress={() => {
              setOpen(false);
            }}
            className="justify-start bg-transparent"
            beforeIcon={<Icon color={colors.danger} name="trash-outline" />}
          >
            Delete
          </Button>
        </View>
      </Popover>
    </Paper>
  );
};
