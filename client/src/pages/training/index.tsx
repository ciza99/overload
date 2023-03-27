import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { screens } from "@constants/screens";
import { Templates } from "./templates";
import { Training } from "./training";

const TrainingStack = createNativeStackNavigator();

export const TrainingRoutes = () => {
  return (
    <TrainingStack.Navigator initialRouteName={screens.templates.key}>
      <TrainingStack.Screen
        name={screens.templates.key}
        options={{ title: screens.templates.title }}
        component={Templates}
      />
      <TrainingStack.Screen
        name={screens.training.key}
        options={{ title: screens.training.title }}
        component={Training}
      />
    </TrainingStack.Navigator>
  );
};
