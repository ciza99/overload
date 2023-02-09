import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Spinner, Box } from "@components/common";
import { Login } from "@pages/login";
import { screens } from "@constants/screens";
import { useTheme } from "@components/theme";
import { Home } from "@pages/home";
import { SignUp } from "@pages/sign-up";
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
  const theme = useTheme();
  const setUser = useStore((store) => store.auth.setUser);
  const user = useStore((store) => store.auth.user);

  const { isLoading } = trpc.sessions.get.useQuery(undefined, {
    onSuccess: ({ user }) => setUser(user),
    onError: () => {
      setUser(undefined);
      tokenHandler.deleteToken();
    },
    retry: 1,
  });

  if (isLoading)
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner scale={2} />
      </Box>
    );

  return (
    <Stack.Navigator
      initialRouteName={screens.login.key}
      screenOptions={{
        navigationBarColor: theme.palette.primary,
        headerTintColor: theme.palette.primary,
        headerStyle: { backgroundColor: "#252628" },
        headerTitleStyle: { color: theme.palette.text },
        contentStyle: {
          backgroundColor: theme.palette.background,
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
