import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Icon, Spinner } from "@components/common";
import { Login } from "@pages/login";
import { screens } from "@constants/screens";
import { ProfileRoutes } from "@pages/profile";
import { SignUp } from "@pages/sign-up";
import { trpc } from "@utils/trpc";
import { useStore } from "@components/store/use-store";
import { tokenHandler } from "@utils/token-handler";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Training } from "./training/training";
import { TrainingRoutes } from "./training";
import { SortExample } from "@components/sort-example";
import { TemplateType, TrainingType } from "./training/templates/types";

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
  session: { session: TrainingType };

  history: undefined;

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
      <View className="grow justify-center items-center bg-base-800">
        <Spinner className="w-14 h-14 border-8" />
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

export const ProtectedRoutes = () => {
  return (
    <Tab.Navigator
      initialRouteName={screens.profile.key}
      screenOptions={{ tabBarShowLabel: false }}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon size="lg" name="person-circle-outline" color={color} />
          ),
        }}
        name={screens.profileRoutes.key}
        component={ProfileRoutes}
      />
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Icon size="lg" name="fitness" color={color} />
          ),
        }}
        name={screens.trainingRoutes.key}
        component={TrainingRoutes}
      />
      <Tab.Screen
        options={{
          title: screens.history.title,
          tabBarIcon: ({ color }) => (
            <Icon size="lg" name="reader-outline" color={color} />
          ),
        }}
        name={screens.history.key}
        component={Training}
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
