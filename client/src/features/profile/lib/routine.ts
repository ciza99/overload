import { differenceInDays } from "date-fns";

import { moduloWrap } from "@features/core/lib/math";

import { Routine } from "../types/routine";

export const getSessionForDate = (date: Date, routine?: Routine) => {
  if (!routine) return null;

  const routineDayOffset = differenceInDays(date, new Date(routine.startedAt));
  const offset = moduloWrap(routineDayOffset, routine.template.sessions.length);

  return routine.template.sessions[offset];
};
