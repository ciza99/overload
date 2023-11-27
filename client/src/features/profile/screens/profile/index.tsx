import { useMemo, useState } from "react";
import { View } from "react-native";

import { useStore } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import {
  Button,
  Icon,
  Paper,
  TextButton,
  Typography,
} from "@features/ui/components";
import { getSessionForDate } from "@features/profile/lib/routine";

import { Calendar } from "./parts/calendar";

export const Profile = () => {
  const user = useStore((store) => store.auth.user);
  const [toggle, setToggle] = useState(false);

  const { data: routine } = trpc.routine.getRoutine.useQuery();
  const sessionToday = useMemo(
    () => getSessionForDate(new Date(), routine),
    [routine]
  );

  return (
    <View className="p-4">
      <Paper className="flex flex-row items-center p-4">
        <Paper elevation={2} className="mr-4 h-16 w-16" />
        <View className="flex flex-col items-start">
          <Typography>{user?.username}</Typography>
          <TextButton>Edit profile</TextButton>
        </View>
      </Paper>
      <Paper className="mt-4">
        <View className="flex flex-row justify-between p-4">
          <Typography>Today:</Typography>
          <Typography className="text-base-300">
            {sessionToday?.isRest ? "Rest day" : sessionToday?.name ?? "-"}
          </Typography>
        </View>
      </Paper>
      <Button
        className="mt-4"
        loading={toggle}
        onPress={() => setToggle((prev) => !prev)}
        beforeIcon={<Icon name="caret-forward" />}
        disabled={sessionToday?.isRest}
      >
        Start training
      </Button>
      <View className="pt-4" />
      <Calendar />
    </View>
  );
};
