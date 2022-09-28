import { RequestHandler } from "express";
import { ObjectSchema, ValidationError } from "joi";

import { StatusError } from "utils/status-error";

export const validationFactory =
  (schema: ObjectSchema): RequestHandler =>
  async (req, _res, next) => {
    try {
      const toValidate = {
        body: req.body,
        params: req.params,
        query: req.query,
      };

      const {
        body = req.body,
        params = req.params,
        query = req.query,
      } = await schema.validateAsync(toValidate);

      req.body = body;
      req.params = params;
      req.query = query;

      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        next(
          new StatusError({
            code: 400,
            message: err.message,
          })
        );
      }

      next(err);
    }
  };
