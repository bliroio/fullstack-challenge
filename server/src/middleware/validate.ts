import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

/**
 * Returns Express middleware that validates req[source] against the given Zod schema.
 *
 * @param schema - A Zod schema to validate against
 * @param source - Which part of the request to validate: "body" (default) or "query"
 * @returns Express middleware function
 *
 * On success: replaces req[source] with the parsed data (coerced, defaulted, trimmed).
 * On failure: responds with 400 and a JSON body containing flattened validation errors.
 */
export const validate =
  (schema: ZodType, source: "body" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      res.status(400).json({
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
      return;
    }

    req[source] = result.data;
    next();
  };
