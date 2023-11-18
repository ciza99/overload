import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { screens } from "@features/core/constants/screens";

import { HistoryScreen } from "../screens/history-screen";

const HistoryStack = createNativeStackNavigator();

export const HistoryRouter = () => {
  return (
    <HistoryStack.Navigator initialRouteName={screens.profile.key}>
      <HistoryStack.Screen
        name={screens.history.key}
        options={{
          title: screens.history.title,
        }}
        component={HistoryScreen}
      />
    </HistoryStack.Navigator>
  );
};
