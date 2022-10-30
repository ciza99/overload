import { useCallback } from "react";

import { Button } from "@components/common";
import { useStore } from "@components/store/use-store";
import { tokenHandler } from "@utils/token-handler";
import { trpc } from "@utils/trpc";
import { View } from "react-native";

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
    <View>
      <Button onPress={logout}>Log out</Button>
    </View>
  );
};
