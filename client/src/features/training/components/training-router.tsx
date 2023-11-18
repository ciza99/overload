import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { screens } from "@features/core/constants/screens";

import { SessionEditor } from "../screens/session";
import { Templates } from "../screens/template";
import { Training } from "../screens/training";

const TrainingStack = createNativeStackNavigator();

export const TrainingRouter = () => {
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
      <TrainingStack.Screen
        name={screens.session.key}
        options={{ title: screens.session.title }}
        component={SessionEditor}
      />
    </TrainingStack.Navigator>
  );
};
