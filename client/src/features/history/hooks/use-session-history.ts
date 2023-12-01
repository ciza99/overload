import { useMemo } from "react";
import { format, startOfMonth } from "date-fns";

import { trpc } from "@features/api/trpc";

import { SessionLog } from "../types";

export const useSessionHistory = () => {
  const { data: sessions, ...rest } = trpc.training.listSessionLogs.useQuery();

  const groupedByDate = useMemo(() => {
    return (
      sessions?.reduce<Record<string, SessionLog[]>>((acc, session) => {
        const month = startOfMonth(new Date(session.startedAt));
        const date = format(month, "MMMM yyyy");
        return {
          ...acc,
          [date]: [...(acc[date] ?? []), session],
        };
      }, {}) ?? {}
    );
  }, [sessions]);

  return useMemo(
    () => ({
      sessions,
      groupedByDate,
      ...rest,
    }),
    [sessions, groupedByDate, rest]
  );
};
