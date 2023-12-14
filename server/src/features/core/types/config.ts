import { NodeEnvironment } from "features/core/types/environement";

export type AppConfig = {
  port: number;
  jwtSecret: string;
  jwtAuthTokenExpTime: number;
  refreshTokenExpTime: number;
  refreshTokenSalt: string;
  environment: NodeEnvironment;
  databaseUrl: string;
};

export type ProcessValueProps<T> = {
  key: string;
  value: T;
};

export type ProcessEnvVariable = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <T = string, K = never>(props: {
    key: string;
    required: true;
    processValue?: (props: ProcessValueProps<string>) => T;
  }): T;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <T, K>(props: {
    key: string;
    processValue: (props: ProcessValueProps<string | undefined>) => T;
  }): T;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <T, K>(props: { key: string; defaultValue: K }): string | K;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  <T, K>(props: { key: string }): string | undefined;
};
