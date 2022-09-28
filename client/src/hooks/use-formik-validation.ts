import { useCallback } from "react";
import { ZodSchema, ParseParams, ZodError } from "zod";

export const useFormikValidation = <TData = unknown>(
  schema: ZodSchema<TData>,
  params?: ParseParams
) =>
  useCallback(
    async (data: unknown) => {
      try {
        await schema.parseAsync(data, params);
      } catch (err) {
        if (!(err instanceof ZodError<TData>)) {
          throw new Error("something when wrong when validating");
        }

        return err.formErrors.fieldErrors;
      }
    },
    [params, schema]
  );
