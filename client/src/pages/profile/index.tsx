import { screens } from "@constants/screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Profile } from "./profile";
import { Settings } from "./settings";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@components/common";

const ProfileStack = createNativeStackNavigator();

export const ProfileRoutes = () => {
  const { navigate } = useNavigation();

  return (
    <ProfileStack.Navigator initialRouteName={screens.profile.key}>
      <ProfileStack.Screen
        name={screens.profile.key}
        options={{
          title: screens.profile.title,
          headerRight: () => (
            <Icon
              color="white"
              size="lg"
              name="settings-outline"
              onPress={() => navigate("settings")}
            />
          ),
        }}
        component={Profile}
      />
      <ProfileStack.Screen
        name={screens.settings.key}
        options={{ title: screens.settings.title }}
        component={Settings}
      />
    </ProfileStack.Navigator>
  );
};
