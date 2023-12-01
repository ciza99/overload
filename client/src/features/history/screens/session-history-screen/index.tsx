import { ScrollView, View } from "react-native";

import { Typography } from "@features/ui/components";
import { useSessionHistory } from "@features/history/hooks/use-session-history";

import { SessionList } from "./parts/session-list";

export const SessionHistoryScreen = () => {
  const { sessions, groupedByDate } = useSessionHistory();

  if (!sessions) return null;

  return (
    <ScrollView className="px-4 py-6">
      <Typography className="mb-6 text-2xl" weight="bold">
        Latest sessions
      </Typography>
      {sessions.length === 0 && (
        <Typography className="text-base-200">
          You don&apos;t have any sessions yet
        </Typography>
      )}
      {Object.entries(groupedByDate).map(([date, sessions]) => (
        <View className="mb-8" key={date}>
          <Typography
            className="mb-4 text-lg capitalize text-primary"
            weight="bold"
          >
            {date}
          </Typography>
          <SessionList sessions={sessions} />
        </View>
      ))}
    </ScrollView>
  );
};
