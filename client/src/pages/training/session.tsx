import { Typography } from "@components/common";
import { NavigationParamMap } from "@pages";
import { useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";

type Props = NativeStackScreenProps<NavigationParamMap, "session">;

export const Session = () => {
  const {
    params: { session },
  } = useRoute<Props["route"]>();

  return (
    <View>
      <Typography>session screen {session.name}</Typography>
    </View>
  );
};
