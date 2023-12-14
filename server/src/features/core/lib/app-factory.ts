import cors from "cors";
import express, { json } from "express";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { createContextFactory } from "features/api/trpc";
import { AppConfig } from "features/core/types/config";
import { prismaFactory } from "features/db/prisma-client";
import { routerFactory } from "features/api/router-factory";
import { userServiceFactory } from "features/user/user-service";
import { userRouterFactory } from "features/user/user-router";
import { sessionRouterFactory } from "features/session/session-router";
import { sessionServiceFactory } from "features/session/session-service";
import { sessionProceduresFactory } from "features/session/session-procedures";
import { userProceduresFactory } from "features/user/user-procedures";
import { trainingRouterFactory } from "features/training/training-router";
import { trainingProducersFactory } from "features/training/training-procedures";
import { trainingServiceFactory } from "features/training/training-service";
import { routineRouterFactory } from "features/routine/routine-router";
import { routineProceduresFactory } from "features/routine/routine-procedures";
import { routineServiceFactory } from "features/routine/routine-service";
import { statisticsServiceFactory } from "features/statistics/statistics-service";
import { statisticsProceduresFactory } from "features/statistics/statistics-procedures";
import { statisticsRouterFactory } from "features/statistics/statistics-router";

type AppFactoryProps = {
  config: AppConfig;
};

export const appFactory = ({ config }: AppFactoryProps) => {
  const app = express();
  const db = prismaFactory();

  const userService = userServiceFactory({ db });
  const sessionService = sessionServiceFactory({ db, config });
  const trainingService = trainingServiceFactory({ db });
  const routineService = routineServiceFactory({ db });
  const statisticsService = statisticsServiceFactory({ db });

  const userProducers = userProceduresFactory({ userService });
  const sessionProcedures = sessionProceduresFactory({
    config,
    sessionService,
    userService,
  });
  const trainingProcedures = trainingProducersFactory({ trainingService });
  const routineProcedures = routineProceduresFactory({ routineService });
  const statisticsProcedures = statisticsProceduresFactory({
    statisticsService,
  });

  const userRouter = userRouterFactory({ userProcedures: userProducers });
  const sessionRouter = sessionRouterFactory({ sessionProcedures });
  const trainingRouter = trainingRouterFactory({ trainingProcedures });
  const routineRouter = routineRouterFactory({ routineProcedures });
  const statisticsRouter = statisticsRouterFactory({ statisticsProcedures });

  const router = routerFactory({
    userRouter,
    sessionRouter,
    trainingRouter,
    routineRouter,
    statisticsRouter,
  });

  const trpc = createExpressMiddleware({
    router,
    createContext: createContextFactory({ config, db, sessionService }),
    onError: ({ path, ctx, error, input }) => {
      console.error(`error at ${path}\n`, { error, input, ctx });
    },
  });

  app.use(json());
  app.use(cors());
  app.use(cookieParser());
  app.use(trpc);

  return app;
};
