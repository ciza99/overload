import { useCallback } from "react";
import { View } from "react-native";
import { format, eachDayOfInterval, addMonths } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

import { Button, Paper, Typography, TextButton } from "@components/common";
import { useStore } from "@components/store/use-store";
import { tokenHandler } from "@utils/token-handler";
import { trpc } from "@utils/trpc";

export const Home = () => {
  const setUser = useStore((store) => store.auth.setUser);
  const user = useStore((store) => store.auth.user);

  const { mutate } = trpc.sessions.logout.useMutation({
    onMutate: () => {
      setUser(undefined);
      tokenHandler.deleteToken();
    },
  });

  const logout = useCallback(() => mutate(), [mutate]);

  return (
    <View className="p-4">
      <Paper className="p-4 flex flex-row items-center">
        <Paper className="h-16 w-16 mr-4" />
        <View className="flex flex-col items-start">
          <Typography>{user?.username}</Typography>
          <TextButton>Edit profile</TextButton>
        </View>
      </Paper>
      <Paper className="mt-4">
        <View className="p-4 flex flex-row justify-between">
          <Typography>Today:</Typography>
          <Typography className="text-muted">Push training 1</Typography>
        </View>
      </Paper>
      <Button
        className="mt-4"
        beforeIcon={<Ionicons name="caret-forward" />}
        onPress={logout}
      >
        Start training
      </Button>
      <View className="pt-4" />
      <Calendar />
    </View>
  );
};

const Calendar = () => {
  const days = eachDayOfInterval({
    start: new Date(),
    end: addMonths(new Date(), 1),
  });

  return (
    <View>
      <View className="flex flex-row justify-between">
        <Ionicons size={20} color="white" name="chevron-back" />
        <Typography weight="bold" className="text-2xl">
          {format(new Date(), "MMMM yyyy")}
        </Typography>
        <Ionicons size={20} color="white" name="chevron-forward" />
      </View>
      <View className="flex flex-row flex-wrap justify-center items-center mt-4">
        {days.map((_date, i) => (
          <Button
            key={i}
            variant="outlined"
            className="p-1 mx-1 my-1 h-12 w-12"
          >
            <Typography>{i + 1}</Typography>
          </Button>
        ))}
      </View>
    </View>
  );
};
