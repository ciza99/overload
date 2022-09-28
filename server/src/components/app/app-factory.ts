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
import { userProducersFactory } from "components/user/user-procedures";

type AppFactoryProps = {
  config: AppConfig;
};

export const appFactory = ({ config }: AppFactoryProps) => {
  const app = express();

  const corsMiddleware = cors();

  const db = prismaFactory();

  const userService = userServiceFactory({ db });
  const sessionService = sessionServiceFactory({ db, config });

  const userProducers = userProducersFactory({ userService });
  const sessionProcedures = sessionProceduresFactory({
    config,
    sessionService,
    userService,
  });

  const userRouter = userRouterFactory({ userProducers });
  const sessionRouter = sessionRouterFactory({ sessionProcedures });

  const router = routerFactory({ userRouter, sessionRouter });
  const trpc = createExpressMiddleware({
    router,
    createContext: createContextFactory({ config, db, sessionService }),
  });

  app.use(json());
  app.use(corsMiddleware);
  app.use(cookieParser());
  app.use(trpc);

  return app;
};
