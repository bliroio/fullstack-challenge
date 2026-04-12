## Context

The Express server has no input validation layer. Raw values from `req.body` and `req.query` flow directly into service functions and MongoDB queries. Zod 4 is already installed in `server/package.json`. The shared package exports `createMeetingSchema` and `listQuerySchema` which define the canonical validation rules. BE-004 (POST /api/meetings) and BE-005 (GET /api/meetings with query params) will consume this middleware.

## Goals / Non-Goals

**Goals:**
- Provide a single `validate(schema, source)` factory that returns a standard Express middleware
- Return 400 with structured, field-level errors on validation failure
- Replace `req[source]` with Zod-parsed data on success (coercion, defaults, trimming applied)
- 100% unit-tested in isolation (no server, no database) with property-based tests via `fast-check`

**Non-Goals:**
- Wiring the middleware to any routes (that is BE-004/BE-005 scope)
- Validating request headers, cookies, or path parameters
- Custom error formatting beyond `error.flatten().fieldErrors`

## Decisions

**Decision: Factory function pattern over class or decorator**
`validate(schema, source)` returns a closure. This is the idiomatic Express pattern — it composes cleanly in route definitions: `router.post("/", validate(createMeetingSchema, "body"), handler)`. A class or decorator would add ceremony with no benefit.

**Decision: `safeParse` over `parse`**
`schema.safeParse()` never throws. It returns a discriminated union `{ success, data } | { success, error }`. This makes error handling explicit and avoids try/catch boilerplate in middleware.

**Decision: `error.flatten().fieldErrors` for the error response**
Returns an object keyed by field name with arrays of error message strings — e.g., `{ title: ["Required"] }`. This format is directly consumable by form libraries on the frontend and consistent with how Zod errors are typically surfaced.

**Decision: `source` defaults to `"body"`**
POST/PUT/PATCH endpoints (the majority) validate body. GET endpoints explicitly pass `"query"`. The default reduces noise at the call site.

**Decision: Property-based tests with `fast-check`**
Rather than hand-picking a handful of valid/invalid inputs, `fast-check` generates 100+ cases per property. This catches edge cases in Zod's coercion logic (e.g., numeric strings, boundary values) that unit tests typically miss.

## Risks / Trade-offs

- [Risk] `req[source] = result.data` mutates the request object — Express does not type-check this, so downstream TypeScript code still sees the original `req.query` type. → Mitigation: Downstream handlers should cast via the schema's inferred type. This is standard Express practice and acceptable until a full typed-request wrapper is introduced.
- [Risk] `fast-check` is a dev dependency; if it is not already installed in `server/`, it must be added. → Mitigation: Check `server/package.json` before implementation and add if missing.
