import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Request, Response, RequestHandler } from "express";
import { DeepMockProxy, mockDeep, mockFn } from "jest-mock-extended";
import { sign } from "jsonwebtoken";

import { SessionService } from "components/session/session-service/session-service-types";
import { AppConfig } from "config/config-types";

import { authMiddlewareFactory } from "./auth-middleware";

describe("auth middleware", () => {
  let db: DeepMockProxy<PrismaClient>;
  let sessionService: DeepMockProxy<SessionService>;
  let authMiddlware: RequestHandler;
  let config: AppConfig;

  beforeEach(() => {
    db = mockDeep();
    sessionService = mockDeep();
    config = {
      port: 3000,
      environment: "development",
      jwtSecret: "abc",
      jwtAuthTokenExpTime: 60,
      refreshTokenExpTime: 3600,
      refreshTokenSalt: "abcd",
    };
    authMiddlware = authMiddlewareFactory({ config, db, sessionService });
  });

  const invalidAuthRequest = [
    mockDeep<Request>({ headers: { authorization: "auth abcdefg" } }),
    mockDeep<Request>({
      headers: { authorization: `Bearer ${sign({}, "abcd")}` },
    }),
  ];

  it.each(invalidAuthRequest)(
    "throws when invalid auth token received",
    async (req) => {
      const res = mockDeep<Response>();
      const next = mockFn<NextFunction>();

      await authMiddlware(req, res, next);
      expect(res.cookie).not.toBeCalled();
      expect(res.header).not.toBeCalled();
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    }
  );

  it("attaches user to request when valid token received", async () => {
    const id = 0;
    const req = mockDeep<Request & { user?: User }>({
      headers: { authorization: `Bearer ${sign({ id }, config.jwtSecret)}` },
    });
    const res = mockDeep<Response>();
    const next = mockFn<NextFunction>();

    const user = mockDeep<User>({ username: "mike" });

    db.user.findFirst.mockResolvedValue(user);

    await authMiddlware(req, res, next);
    expect(next).toBeCalledWith();
    expect(db.user.findFirst).toBeCalledWith({ where: { id } });
    expect(req.user).toEqual(user);
  });

  it("attaches user and rotates refresh token when no auth token but refresh token received", async () => {
    const req = mockDeep<Request & { user?: User }>({
      headers: {
        authorization: undefined,
      },
      cookies: {
        refreshToken: "abcdefg",
      },
    });
    const res = mockDeep<Response>();
    const next = mockFn<NextFunction>();

    const user = mockDeep<User>();
    const expiresIn = new Date();
    const refreshToken = "refresh-token";

    res.cookie.mockReturnValue(res);

    sessionService.rotateRefreshToken.mockResolvedValue({
      user,
      token: refreshToken,
      expiresIn,
    });

    const token = "auth-token";

    sessionService.issueJwtToken.mockReturnValue({ token, expiresIn });

    await authMiddlware(req, res, next);
    expect(req.user).toEqual(user);
    expect(res.cookie).toBeCalledWith("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      expires: expiresIn,
    });
    expect(res.header).toBeCalledWith("token", token);
    expect(next).toBeCalledWith();
  });
});
