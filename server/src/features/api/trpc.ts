import { PrismaClient } from "@prisma/client";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { TokenExpiredError, verify } from "jsonwebtoken";
import { SessionService } from "features/session/session-service";
import { JwtTokenPayload } from "features/session/session-types";
import { AppConfig } from "features/core/types/config";

export const t = initTRPC.context<Context>().create();

export const createContextFactory =
  ({
    config,
    db,
    sessionService,
  }: {
    sessionService: SessionService;
    config: AppConfig;
    db: PrismaClient;
  }) =>
  async ({ req, res }: CreateExpressContextOptions) => {
    const refreshTokenFnc = async () => {
      try {
        const {
          user,
          token: refreshToken,
          expiresIn: refreshTokenExpiresIn,
        } = await sessionService.rotateRefreshToken(
          req.cookies["refreshToken"],
          config.refreshTokenExpTime
        );

        const { token } = sessionService.issueJwtToken(
          user,
          config.jwtAuthTokenExpTime
        );

        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: config.environment !== "development",
            expires: refreshTokenExpiresIn,
          })
          .header("token", token);

        return { user, req, res };
      } catch (err) {
        return { req, res };
      }
    };

    const authHeader = req.headers["authorization"];

    if (!authHeader) return refreshTokenFnc();

    const [method, token] = authHeader.split(" ") as (string | undefined)[];
    if (method !== "Bearer" || !token?.length) return { req, res };

    try {
      const { id } = verify(token, config.jwtSecret) as JwtTokenPayload;
      const user = await db.user.findFirst({ where: { id } });

      if (!user) return { req, res };

      return { user, req, res };
    } catch (err) {
      if (!(err instanceof TokenExpiredError)) return { req, res };

      return refreshTokenFnc();
    }
  };

type Context = inferAsyncReturnType<ReturnType<typeof createContextFactory>>;
