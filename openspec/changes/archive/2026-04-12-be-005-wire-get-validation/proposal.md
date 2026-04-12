## Why

The `GET /api/meetings` route accepts `page`, `limit`, and `title` query parameters but passes them raw to the controller and service — no coercion, no bounds checking, no defaults. This allows negative pages, arbitrarily large limits, and overly long title strings to reach the database layer. The `validate` middleware and `listQuerySchema` already exist (from BE-002 and ALL-006); they just aren't wired to this route yet.

## What Changes

- Add `listQuerySchema` to the shared-schemas import in `server/src/routes/meetingRoutes.ts`
- Replace `router.get("/", listMeetings)` with `router.get("/", validate(listQuerySchema, "query"), listMeetings)` so query params are validated and coerced before reaching the controller
- Create `server/src/__tests__/meetings.get.test.ts` with integration + property-based tests (fast-check) that confirm defaults, coercion, and rejection of invalid inputs

## Capabilities

### New Capabilities

- `get-meetings-query-validation`: Validation and coercion of `page`, `limit`, and `title` query parameters on the `GET /api/meetings` route using Zod middleware

### Modified Capabilities

- `request-validation-middleware`: The `validate` middleware is now used for a `"query"` target (previously only used for `"body"` on the POST route)

## Impact

- **File changed**: `server/src/routes/meetingRoutes.ts` — import and route definition only
- **File created**: `server/src/__tests__/meetings.get.test.ts` — integration tests
- **APIs**: `GET /api/meetings` now returns HTTP 400 for invalid query params (was silently ignoring or passing junk to MongoDB)
- **Dependencies**: No new dependencies; `fast-check` and `supertest` already installed for the BE-004 test suite
