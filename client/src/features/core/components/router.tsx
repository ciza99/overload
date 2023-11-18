import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { screens } from "@features/core/constants/screens";
import { useStore } from "@features/core/hooks/use-store";
import { trpc } from "@features/api/trpc";
import { Icon, Spinner } from "@features/ui/components";
import { SortExample } from "@features/ui/components/sort-example";
import { tokenHandler } from "@features/auth/lib/token-handler";
import { Login } from "@features/auth/screens/login";
import { SignUp } from "@features/auth/screens/sign-up";
import { HistoryRouter } from "@features/history/components/history-router";
import { ProfileRouter } from "@features/profile/components/profile-router";

import { TrainingRouter } from "../../training/components/training-router";
import { SessionType } from "../../training/types/training";
import { TabBar } from "./tab-bar";

export type NavigationParamMap = {
  login: undefined;
  signUp: undefined;

  protectedRoutes: undefined;

  profileRoutes: undefined;
  profile: undefined;
  settings: undefined;

  trainingRoutes: undefined;
  templates: undefined;
  training: { templateId: number };
  session: { session: SessionType };

  history: undefined;
  historyRoutes: undefined;

  statistics: undefined;
};

export type RouteKey = keyof NavigationParamMap;

const AuthGateStack = createNativeStackNavigator();

export const Router = () => {
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
      <View className="grow items-center justify-center bg-base-800">
        <Spinner className="h-14 w-14 border-8" />
      </View>
    );

  return (
    <AuthGateStack.Navigator
      initialRouteName={screens.login.key}
      screenOptions={{ headerShown: false }}
    >
      {user ? (
        <>
          <AuthGateStack.Screen
            name={screens.protectedRoutes.key}
            options={{ title: screens.profile.title, headerShown: false }}
            component={ProtectedRoutes}
          />
        </>
      ) : (
        <>
          <AuthGateStack.Screen
            name={screens.login.key}
            options={{ title: screens.login.title }}
            component={Login}
          />
          <AuthGateStack.Screen
            name={screens.signUp.key}
            options={{ title: screens.signUp.title }}
            component={SignUp}
          />
        </>
      )}
    </AuthGateStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const ProtectedRoutes = () => {
  return (
    <Tab.Navigator
      initialRouteName={screens.profile.key}
      screenOptions={{ tabBarShowLabel: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon size="lg" name="person-circle-outline" color={color} />
          ),
        }}
        name={screens.profileRoutes.key}
        component={ProfileRouter}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon size="lg" name="fitness" color={color} />
          ),
        }}
        name={screens.trainingRoutes.key}
        component={TrainingRouter}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon size="lg" name="reader-outline" color={color} />
          ),
        }}
        name={screens.historyRoutes.key}
        component={HistoryRouter}
      />
      <Tab.Screen
        options={{
          title: screens.statistics.title,
          tabBarIcon: ({ color }) => (
            <Icon size="lg" name="stats-chart" color={color} />
          ),
        }}
        name={screens.statistics.key}
        component={SortExample}
      />
    </Tab.Navigator>
  );
};
