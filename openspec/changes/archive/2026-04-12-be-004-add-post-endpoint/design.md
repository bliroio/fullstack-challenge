## Context

The Express backend has a `GET /api/meetings` route but no `POST /api/meetings` route. The validation middleware (`validate`) and shared Zod schemas (`createMeetingSchema`, `CreateMeetingInput`) are already in place from BE-002 and ALL-006. The `asyncHandler` utility from BE-000 wraps controllers to propagate errors to the global handler. The service layer pattern (service → controller → route) is established. This task follows that established pattern exactly.

## Goals / Non-Goals

**Goals:**
- Add `POST /api/meetings` that validates the request body, persists a new meeting, and returns HTTP 201
- Follow the existing service → controller → route layering
- Apply `createMeetingSchema` validation via the `validate` middleware before the controller
- Add integration tests (TDD red-first, then green after implementation)

**Non-Goals:**
- Authentication or authorization (out of scope for this phase)
- Duplicate detection or idempotency keys
- Changing the GET endpoint or any other existing routes
- Modifying the shared schemas (ALL-006 already owns that)

## Decisions

### 1. Use existing `validate` middleware rather than inline validation

The `validate(schema)` middleware from BE-002 is the established pattern. Placing it as the first route handler ensures the controller only receives already-validated and coerced data. This avoids duplicating validation logic in the controller.

**Alternative considered**: Validate inside the controller. Rejected — it mixes concerns and bypasses the middleware chain established by BE-002.

### 2. Return HTTP 201 with the full persisted document

`Meeting.create(data)` returns the Mongoose document. The controller returns it directly as JSON with status 201. The `toJSON` transform (from ALL-005) ensures `_id` is serialized as `id`.

**Alternative considered**: Return only the `id`. Rejected — returning the full document is more useful to the client and avoids a follow-up GET request.

### 3. Service receives `CreateMeetingInput` (typed, already validated)

The service function signature is `createMeeting(data: CreateMeetingInput)`. By the time execution reaches the service, the middleware has already coerced and validated the input. The service does not re-validate.

### 4. TDD red-first test file

The test file is written before the implementation. It uses `supertest` against the Express app (not a live server), `fast-check` for property-based coverage, and Vitest for the test runner. The test directly connects to a test MongoDB instance.

## Risks / Trade-offs

- [Risk] `Meeting.create` may throw a Mongoose validation error if the Mongoose schema has stricter constraints than the Zod schema. → Mitigation: The Mongoose schema and Zod schema are aligned; `asyncHandler` propagates any unhandled errors to the global error handler which returns a 500.
- [Risk] `toJSON` transform not in place causes `id` to be undefined in the response body. → Mitigation: ALL-005 added the `toJSON` transform; this task relies on it.
- [Risk] Property-based tests with `numRuns: 20` hit MongoDB 20 times per property, slowing CI. → Mitigation: Acceptable for integration tests; `afterEach` cleans up between runs.
