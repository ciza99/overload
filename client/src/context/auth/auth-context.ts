import { createContext, useContext } from "react";

import { AuthContextType } from "./auth-types";

export const AuthContext = createContext<AuthContextType>(undefined as never);

export const useAuth = () => useContext(AuthContext);
