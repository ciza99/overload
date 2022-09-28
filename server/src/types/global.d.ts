import { NodeEnvironment } from "types/environement";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: NodeEnvironment;
    }
  }
}
