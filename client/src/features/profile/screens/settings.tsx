import { useCallback } from "react";
import { View } from "react-native";

import { useStore } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import { TextButton, Typography } from "@features/ui/components";
import { tokenHandler } from "@features/auth/lib/token-handler";

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
