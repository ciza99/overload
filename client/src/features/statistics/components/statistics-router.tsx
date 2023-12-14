import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { screens } from "@features/core/constants/screens";

import { StatisticsScreen } from "../screens/statistics-screen";

const StatisticsStack = createNativeStackNavigator();

export const StatisticsRouter = () => {
  return (
    <StatisticsStack.Navigator initialRouteName={screens.profile.key}>
      <StatisticsStack.Screen
        name={screens.statistics.key}
        options={{
          title: screens.statistics.title,
        }}
        component={StatisticsScreen}
      />
    </StatisticsStack.Navigator>
  );
};
