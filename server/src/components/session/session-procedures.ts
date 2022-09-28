import { z } from "zod";

import { t } from "utils/trpc";
import { createUserDto } from "components/user/user-utils";
import { UserService } from "components/user/user-service";
import { AppConfig } from "config/config-types";
import { authMiddleware } from "middlewares/auth-middleware";

import { createLoginError } from "./session-errors";
import { SessionService } from "./session-service";

export type SessionProcedures = ReturnType<typeof sessionProceduresFactory>;

export const sessionProceduresFactory = ({
  config,
  sessionService,
  userService,
}: {
  config: AppConfig;
  sessionService: SessionService;
  userService: UserService;
}) => ({
  get: t.procedure.use(authMiddleware).query(({ ctx }) => {
    const { user } = ctx;

    return { user: createUserDto(user) };
  }),

  login: t.procedure
    .input(
      z
        .object({
          email: z.string().email(),
          password: z.string().min(4),
        })
        .required()
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;

      const user = await userService.findUserWithEmail(email, createLoginError);
      await sessionService.validatePassword(user, password);

      const { token } = sessionService.issueJwtToken(
        user,
        config.jwtAuthTokenExpTime
      );
      const { token: refreshToken, expiresIn: refreshTokenExpiresIn } =
        await sessionService.issueRefreshToken(
          user,
          config.refreshTokenExpTime
        );

      ctx.res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.environment !== "development",
        expires: refreshTokenExpiresIn,
      });

      return { user: createUserDto(user), token };
    }),

  logout: t.procedure.use(authMiddleware).mutation(async ({ ctx }) => {
    const { user } = ctx;
    await sessionService.revokeRefreshTokens(user);

    ctx.res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: config.environment !== "development",
      expires: new Date(),
    });
    return { message: "logged out" };
  }),

  refreshAuthToken: t.procedure.mutation(async ({ ctx }) => {
    const {
      user,
      token: refreshToken,
      expiresIn: refreshTokenExpiresIn,
    } = await sessionService.rotateRefreshToken(
      ctx.req.cookies["refreshToken"],
      config.refreshTokenExpTime
    );

    const { token, expiresIn } = sessionService.issueJwtToken(
      user,
      config.jwtAuthTokenExpTime
    );

    ctx.res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.environment !== "development",
      expires: refreshTokenExpiresIn,
    });

    return {
      user: createUserDto(user),
      token,
      expiresIn: expiresIn.toISOString(),
    };
  }),
});
