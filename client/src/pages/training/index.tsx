import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { screens } from "@constants/screens";
import { TemplateScreen } from "./templates";
import { Training } from "./training";
import { Sessions } from "./templates/sessions";

const TrainingStack = createNativeStackNavigator();

export const TrainingRoutes = () => {
  return (
    <TrainingStack.Navigator initialRouteName={screens.templates.key}>
      <TrainingStack.Screen
        name={screens.templates.key}
        options={{ title: screens.templates.title }}
        component={TemplateScreen}
      />
      <TrainingStack.Screen
        name={screens.training.key}
        options={{ title: screens.training.title }}
        component={Sessions}
      />
    </TrainingStack.Navigator>
  );
};
