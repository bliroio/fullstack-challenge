import { describe, it, expect, vi } from "vitest";
import fc from "fast-check";
import { Request, Response, NextFunction } from "express";
import { validate } from "../validate";
import { listQuerySchema, createMeetingSchema } from "shared";

// Helper to create mock Express objects
function mockReqResNext(overrides: Partial<Request> = {}) {
  const req = {
    body: {},
    query: {},
    ...overrides,
  } as unknown as Request;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;

  const next = vi.fn() as unknown as NextFunction;

  return { req, res, next };
}

// Manual arbitrary for valid query params
const validQueryArb = fc.record({
  page: fc.integer({ min: 1, max: 1000 }).map(String),
  limit: fc.integer({ min: 1, max: 100 }).map(String),
});

describe("validate middleware", () => {
  describe("with listQuerySchema on query", () => {
    const middleware = validate(listQuerySchema, "query");

    it("calls next() for any valid listQuerySchema input and replaces req.query with parsed data", () => {
      fc.assert(
        fc.property(validQueryArb, (input) => {
          const { req, res, next } = mockReqResNext({ query: input as any });
          middleware(req, res, next);

          expect(next).toHaveBeenCalled();
          expect(res.status).not.toHaveBeenCalled();

          // req.query should now contain parsed (coerced, defaulted) data
          const parsed = req.query as any;
          expect(typeof parsed.page).toBe("number");
          expect(typeof parsed.limit).toBe("number");
        }),
        { numRuns: 100 }
      );
    });

    it("returns 400 with errors for invalid input", () => {
      fc.assert(
        fc.property(
          fc.record({
            page: fc.constantFrom("abc", "not-a-number", ""),
            limit: fc.constantFrom("xyz", "bad", ""),
          }),
          (input) => {
            const { req, res, next } = mockReqResNext({ query: input as any });
            middleware(req, res, next);

            expect(next).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
              expect.objectContaining({
                message: "Validation failed",
                errors: expect.any(Object),
              })
            );
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe("with body validation", () => {
    it("returns 400 when required fields are missing", () => {
      const middleware = validate(createMeetingSchema, "body");
      const { req, res, next } = mockReqResNext({ body: {} });

      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Validation failed",
          errors: expect.any(Object),
        })
      );
    });
  });
});
