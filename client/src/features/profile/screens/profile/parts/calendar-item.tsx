import { FC, useState } from "react";
import { flip, shift, useFloating } from "@floating-ui/react-native";
import clsx from "clsx";
import { format, isSameDay, isSameMonth, isToday } from "date-fns";

import { Button, Typography } from "@features/ui/components";
import { Popover } from "@features/ui/components/popover";
import { SessionLog } from "@features/history/types";
import { Routine } from "@features/profile/types/routine";

import { CalendarPopover } from "./calendar-popover";

export const CalendarItem: FC<{
  routine: Routine;
  date: Date;
  sessionLogs: SessionLog[];
  month: Date;
}> = ({ month, routine, date, sessionLogs }) => {
  const currentSessionLogs = sessionLogs.filter(({ startedAt }) =>
    isSameDay(new Date(startedAt), date)
  );
  const hasSessionLogs = !!currentSessionLogs.length;
  const isThisMonth = isSameMonth(date, month);
  const [isOpen, setIsOpen] = useState(false);

  const { floatingStyles, refs } = useFloating({
    sameScrollView: false,
    placement: "bottom",
    middleware: [flip(), shift({ padding: 16 })],
  });

  return (
    <>
      <Button
        variant="secondary"
        ref={refs.setReference}
        className={clsx("mx-1 my-1 h-12 w-12 flex-[1] bg-base-700 p-1", {
          "border border-base-200": isToday(date),
        })}
        onPress={() => setIsOpen(true)}
      >
        <Typography
          className={clsx({
            "text-base-100": !isToday(date),
            "text-primary": isThisMonth && hasSessionLogs,
            "text-base-400": !isThisMonth,
          })}
        >
          {format(date, "d")}
        </Typography>
      </Button>

      <Popover
        visible={isOpen}
        ref={refs.setFloating}
        showOverlay
        style={floatingStyles}
        onDismiss={() => setIsOpen(false)}
      >
        <CalendarPopover
          routine={routine}
          sessionLogs={currentSessionLogs}
          date={date}
          close={() => setIsOpen(false)}
        />
      </Popover>
    </>
  );
};
