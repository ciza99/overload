import cors from "cors";
import express, { json } from "express";
import cookieParser from "cookie-parser";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { createContextFactory } from "utils/trpc";
import { AppConfig } from "config/config-types";
import { prismaFactory } from "utils/prisma-client";
import { routerFactory } from "components/router/router";
import { userServiceFactory } from "components/user/user-service";
import { userRouterFactory } from "components/user/user-router";
import { sessionRouterFactory } from "components/session/session-router";
import { sessionServiceFactory } from "components/session/session-service";
import { sessionProceduresFactory } from "components/session/session-procedures";
import { userProceduresFactory } from "components/user/user-procedures";
import { trainingRouterFactory } from "components/training/training-router";
import { trainingProducersFactory } from "components/training/training-procedures";
import { trainingServiceFactory } from "components/training/training-service";
import { routineRouterFactory } from "components/routine/routine-router";
import { routineProceduresFactory } from "components/routine/routine-procedures";
import { routineServiceFactory } from "components/routine/routine-service";

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

  const userProducers = userProceduresFactory({ userService });
  const sessionProcedures = sessionProceduresFactory({
    config,
    sessionService,
    userService,
  });
  const trainingProcedures = trainingProducersFactory({ trainingService });
  const routineProcedures = routineProceduresFactory({ routineService });

  const userRouter = userRouterFactory({ userProcedures: userProducers });
  const sessionRouter = sessionRouterFactory({ sessionProcedures });
  const trainingRouter = trainingRouterFactory({ trainingProcedures });
  const routineRouter = routineRouterFactory({ routineProcedures });

  const router = routerFactory({
    userRouter,
    sessionRouter,
    trainingRouter,
    routineRouter,
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
