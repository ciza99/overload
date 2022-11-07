import { useCallback } from "react";
import { format, eachDayOfInterval, addMonths } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  TextButton,
} from "@components/common";
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
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4, display: "flex", flexDirection: "row" }}>
        <Paper sx={{ height: 50, width: 50, mr: 4 }} />
        <Stack direction="column" alignItems="flex-start">
          <Typography>{user?.username}</Typography>
          <TextButton>Edit profile</TextButton>
        </Stack>
      </Paper>
      <Paper sx={{ mt: 4 }}>
        <Stack sx={{ p: 4, justifyContent: "space-between" }}>
          <Typography>Today:</Typography>
          <Typography color="muted">Push training 1</Typography>
        </Stack>
      </Paper>
      <Button sx={{ mt: 4 }} beforeIcon={<Ionicons name="caret-forward" />}>
        Start training
      </Button>
      <Box sx={{ pt: 4 }} />
      <Calendar />
    </Box>
  );
};

const Calendar = () => {
  const days = eachDayOfInterval({
    start: new Date(),
    end: addMonths(new Date(), 1),
  });

  return (
    <Box>
      <Stack justifyContent="space-around">
        <Box>
          <Ionicons color="white" name="chevron-back" />
        </Box>
        <Typography variant="title2">
          {format(new Date(), "MMMM yyyy")}
        </Typography>
        <Box>
          <Ionicons color="white" name="chevron-forward" />
        </Box>
      </Stack>
      <Stack alignItems="center" wrap="wrap" sx={{ mt: 4 }}>
        {days.map((_date, i) => (
          <Button
            key={i}
            variant="outlined"
            sx={{ mx: 1, my: 1, height: 50, width: 50 }}
          >
            <Typography>{i}</Typography>
          </Button>
        ))}
      </Stack>
    </Box>
  );
};
