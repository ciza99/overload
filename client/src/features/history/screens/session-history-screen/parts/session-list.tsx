import { FC } from "react";

import { useStore } from "@features/core/hooks/use-store";
import { SessionSummaryDialog } from "@features/history/components/session-summary-dialog";
import { SessionLog } from "@features/history/types";

import { SessionItem } from "./session-item";

export const SessionList: FC<{ sessions: SessionLog[] }> = ({ sessions }) => {
  const open = useStore((state) => state.dialog.open);

  return (
    <>
      {sessions.map((session) => (
        <SessionItem
          key={session.id}
          session={session}
          onPress={() =>
            open({
              Component: SessionSummaryDialog,
              title: "Session summary",
              props: { sessionId: session.id },
            })
          }
        />
      ))}
    </>
  );
};
