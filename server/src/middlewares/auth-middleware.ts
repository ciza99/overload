import { PrismaClient } from "@prisma/client";
import { TokenExpiredError, verify } from "jsonwebtoken";

import { t } from "trpc";
import { AppConfig } from "config/config-types";
import { JwtTokenPayload } from "components/session/session-types";
import { createUnauthorizedError } from "components/session/session-errors";
import { SessionService } from "components/session/session-service";

export type AuthMiddleware = ReturnType<typeof authMiddlewareFactory>;

export const authMiddlewareFactory = ({
  sessionService,
  config,
  db,
}: {
  sessionService: SessionService;
  config: AppConfig;
  db: PrismaClient;
}) =>
  t.middleware(async ({ ctx, next }) => {
    const refreshTokenFnc = async () => {
      const {
        user,
        token: refreshToken,
        expiresIn: refreshTokenExpiresIn,
      } = await sessionService.rotateRefreshToken(
        ctx.req.cookies["refreshToken"],
        config.refreshTokenExpTime
      );

      const { token } = sessionService.issueJwtToken(
        user,
        config.jwtAuthTokenExpTime
      );

      ctx.res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: config.environment !== "development",
          expires: refreshTokenExpiresIn,
        })
        .header("token", token);

      return next({ ctx: { user } });
    };

    const authHeader = ctx.req.headers["authorization"];

    if (!authHeader) {
      return refreshTokenFnc();
    }

    const [method, token] = authHeader.split(" ") as (string | undefined)[];
    if (method !== "Bearer" || !token?.length) {
      throw createUnauthorizedError();
    }

    try {
      const { id } = verify(token, config.jwtSecret) as JwtTokenPayload;
      const user = await db.user.findFirst({ where: { id } });

      if (!user) {
        throw createUnauthorizedError();
      }

      return next({ ctx: { ...ctx, user } });
    } catch (err) {
      if (!(err instanceof TokenExpiredError)) {
        throw createUnauthorizedError();
      }

      return refreshTokenFnc();
    }
  });
