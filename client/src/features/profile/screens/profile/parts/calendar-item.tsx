import { FC } from "react";
import clsx from "clsx";
import { differenceInDays, isToday, startOfMonth } from "date-fns";

import { Button, Typography } from "@features/ui/components";
import { SessionLog } from "@features/history/types";
import { Routine } from "@features/profile/types/routine";

export const CalendarItem: FC<{
  routine: Routine;
  date: Date;
  sessionLogs: SessionLog[];
}> = ({ routine, date, sessionLogs }) => {
  return (
    <Button
      variant="secondary"
      className={clsx("mx-1 my-1 h-12 w-12 p-1", {
        "border border-base-300": isToday(date),
      })}
    >
      <Typography className={clsx({ "text-base-300": !isToday(date) })}>
        {differenceInDays(date, startOfMonth(new Date())) + 1}
      </Typography>
    </Button>
  );
};
