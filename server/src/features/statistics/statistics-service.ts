import { PrismaClient, User } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";
import { ExerciseStatisticsInput } from "./statistics-schema";

export type StatisticsService = ReturnType<typeof statisticsServiceFactory>;

type OneRepMaxData = {
  weight: number;
  performedAt: Date;
};

export const statisticsServiceFactory = ({ db }: { db: PrismaClient }) => {
  const getExerciseStatistics = async (
    {
      exerciseId = 1,
      startDate = startOfMonth(new Date()),
      endDate = endOfMonth(new Date()),
      type,
    }: ExerciseStatisticsInput,
    user: User
  ) => {
    if (type == "1RM") {
      const res = await db.$queryRaw<OneRepMaxData[]>`
        with oneRepMaxes as (
          select max(weight) as weight, DATE_TRUNC('day', sl."startedAt") as "performedAt" 
          from "ExerciseSetLog" as esl
          inner join "SessionExerciseLog" as sel ON sel.id = esl."sessionExerciseId"
          inner join "SessionLog" as sl ON sl.id = sel."sessionId"
          where sel."exerciseId" = ${exerciseId} AND esl.reps = 1 AND sl."userId" = ${user.id} AND sl."startedAt" >= ${startDate} AND sl."startedAt" <= ${endDate}
          group by DATE_TRUNC('day', sl."startedAt")
          order by DATE_TRUNC('day', sl."startedAt") ASC
        )

        select weight, "performedAt" 
        from oneRepMaxes as a
        where exists (
          select 1
          from oneRepMaxes as b
          where a."performedAt" > b."performedAt" AND a.weight > b.weight
        ) or a."performedAt" = (
          select min("performedAt")
          from oneRepMaxes
        )
      `;
      console.log(JSON.stringify(res, null, 2));
      return res;
    }
  };

  return { getExerciseStatistics };
};
