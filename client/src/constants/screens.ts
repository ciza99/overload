import { RouteKey } from "@pages";

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
  home: {
    key: "home",
    title: "Home",
  },
  signUp: {
    key: "signUp",
    title: "Sign up",
  },
};
