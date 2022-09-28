import { PrismaClient, User } from "@prisma/client";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";
import { addSeconds, isBefore } from "date-fns";
import { randomBytes } from "crypto";

import { AppConfig } from "config/config-types";

import { JwtTokenPayload } from "./session-types";
import { createLoginError, createUnauthorizedError } from "./session-errors";

export type SessionService = ReturnType<typeof sessionServiceFactory>;

export const sessionServiceFactory = ({
  db,
  config,
}: {
  db: PrismaClient;
  config: AppConfig;
}) => ({
  async validatePassword(user: User, password: string) {
    const valid = await verify(user.password, password);

    if (!valid) {
      throw createLoginError();
    }
  },

  issueJwtToken({ id }: User, expirationTime: number) {
    const expiresIn = addSeconds(new Date(), expirationTime);
    const expiresInSeconds = expiresIn.getTime() / 1000;

    const payload: JwtTokenPayload = {
      id,
      expiresIn: expiresInSeconds,
    };

    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: expirationTime,
    });

    return { token, expiresIn };
  },

  async hashRefreshToken(token: string) {
    return await hash(token, { salt: Buffer.from(config.refreshTokenSalt) });
  },

  async issueRefreshToken(user: User, expirationTime: number) {
    await db.refreshToken.updateMany({
      data: { isRevoked: true },
      where: { userId: user.id },
    });

    const token = randomBytes(64).toString("hex");
    const hashedToken = await this.hashRefreshToken(token);
    const expiresIn = addSeconds(new Date(), expirationTime);

    await db.refreshToken.create({
      data: { expiresIn, token: hashedToken, userId: user.id },
    });

    return { token, expiresIn };
  },

  revokeRefreshTokens: async (user: User) => {
    await db.refreshToken.updateMany({
      data: { isRevoked: true },
      where: { userId: user.id },
    });
  },

  async rotateRefreshToken(token: string | undefined, expirationTime: number) {
    if (!token) {
      throw createUnauthorizedError();
    }

    const hashedToken = await this.hashRefreshToken(token);

    const refreshToken = await db.refreshToken.findFirst({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!refreshToken) {
      throw createUnauthorizedError();
    }

    const { user } = refreshToken;

    if (
      isBefore(refreshToken.expiresIn, new Date()) ||
      refreshToken.isRevoked
    ) {
      this.revokeRefreshTokens(user);
      throw createUnauthorizedError();
    }

    const { token: newRefreshToken, expiresIn } = await this.issueRefreshToken(
      user,
      expirationTime
    );

    return { token: newRefreshToken, expiresIn, user };
  },
});
