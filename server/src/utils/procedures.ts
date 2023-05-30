import { authMiddleware } from "middlewares/auth-middleware";
import { t } from "utils/trpc";

export const procedure = t.procedure;
export const authProcedure = procedure.use(authMiddleware);
