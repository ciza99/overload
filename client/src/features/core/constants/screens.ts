import { RouteKey } from "@features/core/components/router";

type RouteConfig<TRouteKey extends RouteKey> = {
  key: TRouteKey;
  title: string;
};

type ScreensMap<TKeys extends RouteKey = RouteKey> = {
  [Key in TKeys]: RouteConfig<Key>;
};

export const screens: ScreensMap = {
  login: {
    key: "login",
    title: "Log in",
  },
  profile: {
    key: "profile",
    title: "Profile",
  },
  signUp: {
    key: "signUp",
    title: "Sign up",
  },
  protectedRoutes: {
    key: "protectedRoutes",
    title: "",
  },
  trainingRoutes: {
    key: "trainingRoutes",
    title: "",
  },
  templates: {
    key: "templates",
    title: "Templates",
  },
  training: {
    key: "training",
    title: "Training",
  },
  session: {
    key: "session",
    title: "Session",
  },
  statistics: {
    key: "statistics",
    title: "Statistics",
  },
  profileRoutes: {
    key: "profileRoutes",
    title: "",
  },
  history: {
    key: "history",
    title: "History",
  },
  settings: {
    key: "settings",
    title: "Settings",
  },
};
