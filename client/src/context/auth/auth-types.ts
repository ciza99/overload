import { User } from "models/user";

export type AuthContextType = {
  user?: User;
  isLoading: boolean;
  reauthenticate: () => void;
  logout: () => void;
};
