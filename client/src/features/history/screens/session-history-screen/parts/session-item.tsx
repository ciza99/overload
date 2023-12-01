import { FC } from "react";
import { Pressable, View } from "react-native";
import { format, formatDuration, intervalToDuration } from "date-fns";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Typography } from "@features/ui/components";
import { colors } from "@features/ui/theme";
import { SessionLog } from "@features/history/types";

export const SessionItem: FC<{ session: SessionLog; onPress?: () => void }> = ({
  session,
  onPress,
}) => {
  const isPressed = useSharedValue(false);
  const style = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      isPressed.value ? colors.base[600] : colors.base[700]
    ),
  }));

  return (
    <Pressable
      onPressIn={() => (isPressed.value = true)}
      onPressOut={() => (isPressed.value = false)}
      onPress={onPress}
    >
      <Animated.View className="mb-4 rounded-lg bg-base-700 p-3" style={style}>
        <View className="mb-2 flex flex-row items-center justify-between">
          <Typography weight="bold" className="text-base">
            {session.name}
          </Typography>
          <Typography weight="bold" className="text-base">
            {format(new Date(session.startedAt), "dd.MM.yyyy")}
          </Typography>
        </View>
        <View className="flex flex-row justify-between">
          <Typography className="text-base-200">
            {session.exercises.length} exercises
          </Typography>
          <Typography className="text-base-200">
            {formatDuration(
              intervalToDuration({
                start: new Date(session.startedAt),
                end: new Date(session.endedAt),
              }),
              { format: ["minutes"], zero: true }
            )}
          </Typography>
        </View>
      </Animated.View>
    </Pressable>
  );
};
