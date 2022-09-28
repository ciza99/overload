import { Box, Button } from "components/common/index";
import { useStore } from "components/store/use-store";
import { tokenHandler } from "utils/token-handler";
import { useCallback } from "react";
import { trpc } from "utils/trpc";

export const Home = () => {
  const setUser = useStore((store) => store.auth.setUser);

  const { mutate } = trpc.sessions.logout.useMutation({
    onMutate: () => {
      setUser(undefined);
      tokenHandler.deleteToken();
    },
  });

  const logout = useCallback(() => mutate(), [mutate]);

  return (
    <Box>
      <Button onPress={logout}>Log out</Button>
    </Box>
  );
};
