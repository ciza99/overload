import { User } from "@models/user";
import { v4 } from "uuid";

import create from "zustand";

type AuthSlice = {
  user?: User;
  isLoading: boolean;
  setUser: (user?: User) => void;
};

export type DialogProps<T = {}> = T & {
  id: string;
  close: () => void;
};

type Dialog<T> = {
  title?: string;
  Component: React.FC<DialogProps<T>>;
  id: string;
  props: T;
};

type DialogSlice = {
  dialogs: Dialog<any>[];
  close: (id: string) => void;
  open: <T extends {} = {}>(props: Omit<Dialog<T>, "id">) => void;
};

type Store = {
  auth: AuthSlice;
  dialog: DialogSlice;
};

export const useStore = create<Store>((set) => ({
  auth: {
    user: undefined,
    isLoading: false,
    setUser: (user) => set((state) => ({ auth: { ...state.auth, user } })),
  },
  dialog: {
    close: (id) =>
      set((state) => ({
        dialog: {
          ...state.dialog,
          dialogs: state.dialog.dialogs.filter((dialog) => dialog.id !== id),
        },
      })),
    open: (dialog) =>
      set((state) => ({
        dialog: {
          ...state.dialog,
          dialogs: [...state.dialog.dialogs, { ...dialog, id: v4() }],
        },
      })),
    dialogs: [],
  },
}));
