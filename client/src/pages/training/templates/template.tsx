import { Button, Icon, Paper, Typography } from "@components/common";
import { Popover } from "@components/common/popover";
import { useStore } from "@components/store/use-store";
import { colors } from "@constants/theme";
import { offset, shift, useFloating } from "@floating-ui/react-native";
import { Portal } from "@gorhom/portal";
import { useNavigation } from "@react-navigation/native";
import { trpc } from "@utils/trpc";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  Touchable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { measure, runOnUI, useAnimatedRef } from "react-native-reanimated";
import { TemplateType } from "./types";

export const Template = ({ template }: { template: TemplateType }) => {
  const utils = trpc.useContext();
  const [open, setOpen] = useState(false);
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

  const { mutate: deleteTemplate } = trpc.training.deleteTemplate.useMutation({
    onSuccess: () => {
      utils.training.getTemplates.invalidate();
    },
  });

  return (
    <Paper className="flex flex-row p-2 items-center gap-x-2 mb-3">
      <View>
        <Icon size="lg" color="white" name="reorder-three-outline" />
      </View>
      <Typography weight="bold" className="mr-auto text-lg">
        {template.name}
      </Typography>
      <View ref={refs.setReference}>
        <Icon
          onPress={() => setOpen(true)}
          color="white"
          name="ellipsis-horizontal-outline"
        />
      </View>

      <Popover
        style={floatingStyles}
        ref={refs.setFloating}
        visible={open}
        showOverlay
        onDismiss={() => setOpen(false)}
      >
        <View className="bg-base-700 rounded-lg gap-y-1">
          <Button
            className="justify-start bg-transparent"
            beforeIcon={<Icon color={colors.primary} name="create-outline" />}
            onPress={() => {
              navigate("training", { template });
              setOpen(false);
            }}
          >
            Edit
          </Button>
          <Button
            beforeIcon={<Icon color={colors.primary} name="checkbox-outline" />}
            className="justify-start bg-transparent"
          >
            Make current routine
          </Button>
          <Button
            onPress={() => {
              deleteTemplate({ id: template.id });
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
