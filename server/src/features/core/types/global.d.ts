import { NodeEnvironment } from "features/core/types/environement";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: NodeEnvironment;
    }
  }
}
