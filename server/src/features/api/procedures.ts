import { authMiddleware } from "./middlewares/auth-middleware";
import { t } from "features/api/trpc";

export const procedure = t.procedure;
export const authProcedure = procedure.use(authMiddleware);
