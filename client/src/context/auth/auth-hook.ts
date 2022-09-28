import { useCallback, useMemo, useState } from "react";

import { User } from "models/user";

import { tokenHandler } from "./token-handler";
import { AuthContextType } from "./auth-types";
import { trpc } from "trpc/index";

export const useAuthContext = (): AuthContextType => {
  const utils = trpc.useContext();
  const [user, setUser] = useState<User>();

  const { isLoading } = trpc.sessions.get.useQuery(undefined, {
    retry: false,
    onSuccess: ({ user }) => setUser(user),
    onError: () => {
      setUser(undefined);
      tokenHandler.deleteToken();
    },
  });

  const logoutMutation = trpc.sessions.logout.useMutation({
    onMutate: () => {
      setUser(undefined);
      tokenHandler.deleteToken();
    },
  });

  const reauthenticate = useCallback(
    () => utils.sessions.get.invalidate(),
    [utils.sessions.get]
  );

  console.log({ user });

  const logout = useCallback(() => logoutMutation.mutate(), [logoutMutation]);

  return useMemo(
    () => ({ user, isLoading, reauthenticate, logout }),
    [user, isLoading, reauthenticate, logout]
  );
};
