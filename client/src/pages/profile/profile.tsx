import { View } from "react-native";
import {
  format,
  eachDayOfInterval,
  isToday,
  startOfMonth,
  endOfMonth,
} from "date-fns";

import {
  Button,
  Paper,
  Typography,
  TextButton,
  Icon,
} from "@components/common";
import { useStore } from "@components/store/use-store";
import clsx from "clsx";
import { useState } from "react";

export const Profile = () => {
  const user = useStore((store) => store.auth.user);
  const [toggle, setToggle] = useState(false);

  return (
    <View className="p-4">
      <Paper className="p-4 flex flex-row items-center">
        <Paper elevation={2} className="h-16 w-16 mr-4" />
        <View className="flex flex-col items-start">
          <Typography>{user?.username}</Typography>
          <TextButton>Edit profile</TextButton>
        </View>
      </Paper>
      <Paper className="mt-4">
        <View className="p-4 flex flex-row justify-between">
          <Typography>Today:</Typography>
          <Typography className="text-base-300">Push training 1</Typography>
        </View>
      </Paper>
      <Button
        className="mt-4"
        loading={toggle}
        onPress={() => setToggle((prev) => !prev)}
        beforeIcon={<Icon name="caret-forward" />}
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
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  });

  return (
    <View>
      <View className="flex flex-row justify-between">
        <Icon color="white" name="chevron-back" />
        <Typography weight="bold" className="text-xl">
          {format(new Date(), "MMMM yyyy")}
        </Typography>
        <Icon color="white" name="chevron-forward" />
      </View>
      <View className="flex flex-row flex-wrap justify-center items-center mt-4">
        {days.map((date, i) => (
          <Button
            key={i}
            variant="secondary"
            className={clsx("p-1 mx-1 my-1 h-12 w-12", {
              "border border-base-300": isToday(date),
            })}
          >
            <Typography className={clsx({ "text-base-300": !isToday(date) })}>
              {i + 1}
            </Typography>
          </Button>
        ))}
      </View>
    </View>
  );
};
