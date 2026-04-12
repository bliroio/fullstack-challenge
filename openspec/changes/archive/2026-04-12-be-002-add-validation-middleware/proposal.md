## Why

Express route handlers currently receive raw, unvalidated `req.body` and `req.query` data, allowing malformed or malicious input to reach the service and database layers. A reusable validation middleware using Zod schemas closes this gap at the boundary where requests enter the application.

## What Changes

- New file `server/src/middleware/validate.ts` exporting a `validate(schema, source)` factory function that returns an Express middleware.
- On validation failure: responds immediately with HTTP 400 and a structured JSON error body containing flattened field errors — the request goes no further.
- On validation success: replaces `req[source]` with the Zod-parsed (coerced, defaulted, trimmed) data so downstream handlers receive clean typed values.
- New test file `server/src/middleware/__tests__/validate.test.ts` with property-based tests using `fast-check` covering both success and failure paths.

## Capabilities

### New Capabilities

- `request-validation-middleware`: Reusable Express middleware factory that validates request data against any Zod schema and returns structured 400 errors on failure.

### Modified Capabilities

## Impact

- `server/src/middleware/validate.ts` — new file (no existing consumers yet; BE-004 and BE-005 will wire it to routes)
- `server/src/middleware/__tests__/validate.test.ts` — new test file
- Depends on `shared` package exports: `listQuerySchema`, `createMeetingSchema`
- No breaking changes to existing routes or middleware
