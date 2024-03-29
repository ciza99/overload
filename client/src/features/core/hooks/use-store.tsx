import { View } from "react-native";
import { v4 } from "uuid";
import { create } from "zustand";

import { User } from "@features/auth/types/user";
import { SessionFormType } from "@features/training/types/training";

type AuthSlice = {
  user?: User;
  isLoading: boolean;
  setUser: (user?: User) => void;
};

export type DialogProps<T = object> = T & {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dialogs: Dialog<any>[];
  close: (id: string) => void;
  open: <T extends object = object>(props: Omit<Dialog<T>, "id">) => void;
};

export type Popover<T> = {
  ref: React.RefObject<View>;
  Component: React.FC<T>;
  props: T;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

type PopoverSlice = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Popover<any>;
  close: () => void;
  open: <T extends object = object>(props: Popover<T>) => void;
};

export type SessionState = {
  startedAt: Date;
  templateId: number;
  initialFormValues: SessionFormType;
};

type SessionSlice = SessionState & {
  active: boolean;
  setSession: (sessionData: SessionState) => void;
  endSession: () => void;
};

type Store = {
  auth: AuthSlice;
  dialog: DialogSlice;
  popover: PopoverSlice;
  session: SessionSlice;
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
  session: {
    active: false,
    startedAt: new Date(),
    templateId: 0,
    initialFormValues: { id: 0, name: "New session", exercises: [] },
    setSession: (sessionData) =>
      set((state) => ({
        session: { ...state.session, ...sessionData, active: true },
      })),
    endSession: () =>
      set((state) => ({ session: { ...state.session, active: false } })),
  },
}));
