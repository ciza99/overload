import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { screens } from "@features/core/constants/screens";
import { Icon } from "@features/ui/components";

import { Profile } from "../screens/profile";
import { Settings } from "../screens/settings";

const ProfileStack = createNativeStackNavigator();

export const ProfileRouter = () => {
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
