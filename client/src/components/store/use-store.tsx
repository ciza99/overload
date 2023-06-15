import { User } from "@models/user";
import {
  SessionExerciseType,
  SessionType,
} from "@pages/training/templates/types";
import { ReactNode } from "react";
import { View } from "react-native";
import { v4 } from "uuid";

import { create } from "zustand";

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

export type Popover<T> = {
  ref: React.RefObject<View>;
  Component: React.FC<T>;
  props: T;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

type PopoverSlice = {
  data?: Popover<any>;
  close: () => void;
  open: <T extends {} = {}>(props: Popover<T>) => void;
};

type Store = {
  auth: AuthSlice;
  dialog: DialogSlice;
  popover: PopoverSlice;
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
  popover: {
    data: undefined,
    open: (popover) =>
      set((state) => ({ popover: { ...state.popover, data: popover } })),
    close: () =>
      set((state) => ({ popover: { ...state.popover, data: undefined } })),
  },
}));
