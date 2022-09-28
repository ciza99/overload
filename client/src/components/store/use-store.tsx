import { User } from "models/user";

import create from "zustand";

type AuthSlice = {
  user?: User;
  isLoading: boolean;
  setUser: (user?: User) => void;
};

type Store = {
  auth: AuthSlice;
};

export const useStore = create<Store>((set) => ({
  auth: {
    user: undefined,
    isLoading: false,
    setUser: (user) => set((state) => ({ auth: { ...state.auth, user } })),
  },
}));
