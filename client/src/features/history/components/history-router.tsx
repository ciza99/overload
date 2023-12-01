import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { screens } from "@features/core/constants/screens";

import { SessionHistoryScreen } from "../screens/session-history-screen";

const HistoryStack = createNativeStackNavigator();

export const HistoryRouter = () => {
  return (
    <HistoryStack.Navigator initialRouteName={screens.profile.key}>
      <HistoryStack.Screen
        name={screens.history.key}
        options={{
          title: screens.history.title,
        }}
        component={SessionHistoryScreen}
      />
    </HistoryStack.Navigator>
  );
};
