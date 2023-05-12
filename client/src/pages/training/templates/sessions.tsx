import { Button, Icon, Paper, Typography } from "@components/common";
import { NavigationParamMap } from "@pages";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { View } from "react-native";
import { TemplateType } from "./types";

type Props = NativeStackScreenProps<NavigationParamMap, "training">;

export const Sessions = () => {
  const {
    params: { template },
  } = useRoute<Props["route"]>();

  const [trainings, setTrainings] = useState(template.trainings);

  return (
    <View className="p-4 gap-y-2">
      <View className="flex flex-row items-center justify-between">
        <Typography weight="bold" className="text-2xl">
          {template.name}
        </Typography>
        <Icon name="ellipsis-horizontal-outline" />
      </View>
      <Typography weight="bold" className="text-lg">
        Sessions:
      </Typography>
      {trainings.length === 0 && (
        <Paper className="p-3">
          <Typography className="text-base-300">No sessions yet</Typography>
        </Paper>
      )}
      {trainings.map((training) => (
        <View>
          <Typography>{training.name}</Typography>
        </View>
      ))}
      <Button variant="outlined" beforeIcon={<Icon name="add-outline" />}>
        Add session
      </Button>
    </View>
  );
};
