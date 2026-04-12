import { Request, Response, NextFunction } from "express";

/**
 * Recursively strips keys starting with "$" or containing "." from objects.
 * Returns primitives and arrays unchanged (arrays are traversed recursively).
 */
export const sanitize = <T>(value: T): T => {
  if (value === null || value === undefined || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitize) as T;
  }

  const clean: Record<string, unknown> = {};
  for (const key of Object.keys(value)) {
    if (key.startsWith("$") || key.includes(".")) continue;
    clean[key] = sanitize((value as Record<string, unknown>)[key]);
  }
  return clean as T;
};

/**
 * Express middleware that sanitizes req.body, req.query, and req.params
 * to prevent NoSQL operator injection.
 */
export const mongoSanitize = () =>
  (req: Request, _res: Response, next: NextFunction): void => {
    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    next();
  };
