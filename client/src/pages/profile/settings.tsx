import { View } from "react-native";
import { useCallback } from "react";

import { TextButton, Typography } from "@components/common";
import { trpc } from "@utils/trpc";
import { useStore } from "@components/store/use-store";
import { tokenHandler } from "@utils/token-handler";

export const Settings = () => {
  const setUser = useStore((store) => store.auth.setUser);

  const { mutate } = trpc.sessions.logout.useMutation({
    onMutate: () => {
      setUser(undefined);
      tokenHandler.deleteToken();
    },
  });

  const logout = useCallback(() => mutate(), [mutate]);

  return (
    <View className="p-3">
      <Typography weight="bold" className="text-2xl mb-4">
        Account
      </Typography>
      <TextButton onPress={logout}>Log out</TextButton>
    </View>
  );
};
