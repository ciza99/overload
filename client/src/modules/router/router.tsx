import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Spinner, Box } from "components/index";
import { Login } from "modules/login/login";
import { screens } from "constants/screens";
import { useTheme } from "context/theme/theme-context";
import { useAuth } from "context/auth/auth-context";
import { Home } from "modules/home/home";
import { SignUp } from "modules/sign-up/sign-up";

const Stack = createNativeStackNavigator();

export const Router = () => {
  const theme = useTheme();
  const { user, isLoading } = useAuth();

  if (isLoading) {
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
  }

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
