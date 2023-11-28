import { FC, useMemo, useState } from "react";
import { View } from "react-native";
import { flip, offset, shift, useFloating } from "@floating-ui/react-native";
import clsx from "clsx";
import {
  format,
  formatDuration,
  intervalToDuration,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns";

import {
  Button,
  Divider,
  TextButton,
  Typography,
} from "@features/ui/components";
import { Popover } from "@features/ui/components/popover";
import { SessionLog } from "@features/history/types";
import { getSessionForDate } from "@features/profile/lib/routine";
import { Routine } from "@features/profile/types/routine";

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

  const session = useMemo(
    () => getSessionForDate(date, routine),
    [routine, date]
  );

  const { floatingStyles, refs } = useFloating({
    sameScrollView: false,
    placement: "bottom",
    middleware: [
      flip(),
      shift({ padding: 16 }),
      offset(({ rects }) => {
        return -rects.reference.height;
      }),
    ],
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
            "text-primary": isThisMonth && hasSessionLogs,
            "text-base-100": !isToday(date),
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
        <View className="min-w-[150px] rounded-lg bg-base-700">
          <View className="flex flex-col gap-y-2 p-4">
            <Typography
              weight="bold"
              className={clsx(session?.isRest && "text-base-300")}
            >
              {session?.isRest ? "Rest day" : session?.name ?? "No session"}
            </Typography>
            {!session?.isRest && (
              <TextButton
                onPress={() => {
                  // TODO
                }}
              >
                Start session
              </TextButton>
            )}
          </View>
          <Divider />
          <View className="flex flex-col gap-y-2 p-4">
            {!currentSessionLogs.length && (
              <Typography className="text-sm text-base-100">-</Typography>
            )}
            {currentSessionLogs.map(({ name, startedAt, id }) => {
              return (
                <View
                  key={id}
                  className="flex flex-row justify-between gap-x-8"
                >
                  <Typography className="text-sm text-base-100">
                    {name}
                  </Typography>
                  <Typography className="text-sm text-base-100">
                    {format(new Date(startedAt), "HH:mm")}
                  </Typography>
                </View>
              );
            })}
            {!!currentSessionLogs.length && (
              <TextButton
                onPress={() => {
                  // TODO
                }}
              >
                View history
              </TextButton>
            )}
          </View>
        </View>
      </Popover>
    </>
  );
};
