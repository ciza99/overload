import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";
import { colors } from "@constants/theme";

import { Spinner } from "@components/common";
import { Login } from "@pages/login/login";
import { screens } from "@constants/screens";
import { Home } from "@pages/home/home";
import { SignUp } from "@pages/sign-up/sign-up";
import { trpc } from "@utils/trpc";
import { useStore } from "@components/store/use-store";
import { tokenHandler } from "@utils/token-handler";

export type NavigationParamMap = {
  login: undefined;
  signUp: undefined;
  home: undefined;
};

export type RouteKey = keyof NavigationParamMap;

const Stack = createNativeStackNavigator();

export const Router = () => {
  const setUser = useStore((store) => store.auth.setUser);
  const user = useStore((store) => store.auth.user);

  const { isLoading } = trpc.sessions.get.useQuery(undefined, {
    onSuccess: ({ user }) => setUser(user),
    onError: () => {
      setUser(undefined);
      tokenHandler.deleteToken();
    },
  });

  if (isLoading)
    return (
      <View tw="bg-background grow justify-center items-center">
        <Spinner />
      </View>
    );

  return (
    <Stack.Navigator
      initialRouteName={screens.login.key}
      screenOptions={{
        navigationBarColor: colors.background as string,
        headerTintColor: colors.primary as string,
        headerStyle: { backgroundColor: "#252628" },
        headerTitleStyle: { color: colors.text as string },
        contentStyle: {
          backgroundColor: colors.background as string,
        },
      }}
    >
      {user ? (
        <>
          <Stack.Screen
            name={screens.home.key}
            options={{ title: screens.home.title }}
            component={Home}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name={screens.login.key}
            options={{ title: screens.login.title }}
            component={Login}
          />
          <Stack.Screen
            name={screens.signUp.key}
            options={{ title: screens.signUp.title }}
            component={SignUp}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
