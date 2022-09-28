import { User } from "@prisma/client";

import { NodeEnvironment } from "types/environement";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: NodeEnvironment;
    }
  }
}
