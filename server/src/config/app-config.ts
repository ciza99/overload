import dotenv from "dotenv";

import { AppConfig } from "./config-types";
import {
  processNodeEnvironment,
  processNumberFactory,
  processEnvVariable,
} from "./config-utils";

export const createAppConfig = (): AppConfig => {
  dotenv.config();

  const config: AppConfig = {
    port: processEnvVariable({
      key: "PORT",
      processValue: processNumberFactory(8080),
    }),
    databaseUrl: processEnvVariable({
      key: "DATABASE_URL",
      required: true,
    }),
    jwtSecret: processEnvVariable({ key: "JWT_SECRET", required: true }),
    jwtAuthTokenExpTime: processEnvVariable({
      key: "JWT_AUTH_TOKEN_EXP_TIME",
      processValue: processNumberFactory(60 * 10),
    }),
    refreshTokenExpTime: processEnvVariable({
      key: "REFRESH_TOKEN_EXP_TIME",
      processValue: processNumberFactory(60 * 60 * 24 * 365),
    }),
    refreshTokenSalt: processEnvVariable({
      key: "REFRESH_TOKEN_SALT",
      required: true,
    }),
    environment: processEnvVariable({
      key: "NODE_ENV",
      processValue: processNodeEnvironment,
    }),
  };

  return config;
};
