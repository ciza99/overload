import { screens } from "@constants/screens";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { Profile } from "./profile";
import { Settings } from "./settings";
import { useNavigation } from "@react-navigation/native";

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
            <Ionicons
              color="white"
              name="settings-outline"
              size={24}
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
