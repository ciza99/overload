import { z } from "zod";

import { procedure, authProcedure } from "features/api/procedures";
import { createUserDto } from "features/user/user-utils";
import { UserService } from "features/user/user-service";
import { AppConfig } from "features/core/types/config";

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
  get: authProcedure.query(({ ctx }) => {
    const { user } = ctx;

    return { user: createUserDto(user) };
  }),

  login: procedure
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

  logout: authProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx;
    await sessionService.revokeRefreshTokens(user);

    ctx.res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: config.environment !== "development",
      expires: new Date(),
    });
    return { message: "logged out" };
  }),

  refreshAuthToken: procedure.mutation(async ({ ctx }) => {
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
