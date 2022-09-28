import { ErrorRequestHandler } from "express";

import { ErrorResponse } from "types/error-response";
import { StatusError } from "utils/status-error";
import { AppConfig } from "config/config-types";

const defaultErrorValues = {
  code: 500,
  message: "Unknown error",
  timestamp: undefined,
};

export const errorHandlerFactory =
  (config: AppConfig): ErrorRequestHandler =>
  (error: StatusError | Error, req, res, _next) => {
    const { code, timestamp, message } =
      error instanceof StatusError ? error : defaultErrorValues;

    if (config.environment !== "production") {
      console.log({ error });
    }

    const responseBody: ErrorResponse = {
      code,
      message,
      error: true,
      path: req.path,
      ...(timestamp && { timestamp }),
    };

    res.status(code).json(responseBody);
  };
