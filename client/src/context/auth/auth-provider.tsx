import { ReactNode } from "react";

import { AuthContext } from "./auth-context";
import { useAuthContext } from "./auth-hook";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const authContext = useAuthContext();

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};
