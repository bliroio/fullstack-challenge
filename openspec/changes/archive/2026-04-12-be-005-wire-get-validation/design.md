## Context

The `GET /api/meetings` route currently passes raw `req.query` to the controller with no validation or coercion. All necessary infrastructure exists: the `validate(schema, source)` middleware (BE-002) accepts a `"query"` source argument, and `listQuerySchema` (ALL-006) defines `page` (coerced int, min 1, default 1), `limit` (coerced int, min 1, max 100, default 10), and `title` (optional string, max 200 chars). The POST route already uses `validate(createMeetingSchema)` in the same file, establishing the pattern.

This is a minimal two-line change to `meetingRoutes.ts` plus a new test file — no new architecture, no new dependencies.

## Goals / Non-Goals

**Goals:**
- Wire `validate(listQuerySchema, "query")` to the GET route so invalid/out-of-range query params return HTTP 400 before reaching the controller
- Ensure Zod coercion runs so `req.query.page` is a `number` (not a string) when it reaches `listMeetings`
- Provide a TDD test file with integration and property-based tests

**Non-Goals:**
- Changing the controller, service, or Mongoose query logic
- Updating Swagger/OpenAPI docs (separate task)
- Handling edge cases not covered by `listQuerySchema` (e.g., extra unknown query params — Zod `.strip()` handles silently)

## Decisions

**Decision: Pass `"query"` as the second argument to `validate`**
The `validate` middleware was designed with an optional `source` parameter that defaults to `"body"`. Using `validate(listQuerySchema, "query")` routes validation to `req.query` without any middleware changes. Alternative: a separate `validateQuery` function — rejected because the existing API already supports it cleanly.

**Decision: Write tests first (TDD red phase)**
The plan prescribes writing `meetings.get.test.ts` before the implementation edit so tests fail red, confirming they actually exercise the validation path. The test file uses `fast-check` for property-based coverage of boundary conditions (`page >= 1`, `limit <= 100`).

**Decision: Use `fc.asyncProperty` for property tests**
The GET route requires a live HTTP round-trip (via supertest + in-memory MongoDB), so fast-check async properties are used. `numRuns: 50` keeps the suite fast while still covering a wide input range.

## Risks / Trade-offs

- [Risk] `z.coerce.number()` converts `"abc"` to `NaN`, which `.int().min(1)` then rejects — this is intentional and correct, but the error message reads "Expected integer, received nan" rather than "must be a number". → Acceptable for now; the 400 is returned.
- [Risk] The middleware replaces `req.query` with the parsed object; if any downstream code reads `req.query` as `Record<string, string>` (the default Express type), TypeScript may show type narrowing warnings. → Acceptable; the validated shape is a superset of the raw type.
- [Risk] Property tests require a running MongoDB instance (`TEST_MONGODB_URI`). → Tests will be skipped or fail in CI environments without MongoDB; this is consistent with the existing BE-004 test setup.
