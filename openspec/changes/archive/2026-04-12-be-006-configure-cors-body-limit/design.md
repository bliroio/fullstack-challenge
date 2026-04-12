## Context

The Express server in `server/src/app.ts` initialises CORS with no options (`cors()`) and JSON body parsing with no limit (`express.json()`). Both calls are already in place; this change only adds option objects. No new packages are required. The server already runs helmet, morgan, rate-limiting, mongo-sanitize, and a global error handler — this change slots two options into the existing middleware chain.

## Goals / Non-Goals

**Goals:**
- Restrict `Access-Control-Allow-Origin` to the configured frontend origin only.
- Return HTTP 413 for any JSON body exceeding 1 MB.
- Provide a passing test suite (vitest + supertest) covering both behaviours.
- Allow the allowed origin to be overridden via `FRONTEND_URL` environment variable.

**Non-Goals:**
- Supporting multiple allowed origins (single-origin only for now).
- Changing any route, response shape, or error format.
- Adding CORS credentials support or pre-flight caching configuration.
- Altering other body parsers (urlencoded, raw, etc.).

## Decisions

**D1 — Single-origin callback rather than a list or regex**

The app serves exactly one frontend. The `origin` option uses a callback function that compares the incoming `Origin` header against the configured value and only echoes it back on match. A plain string was considered but rejected because `cors({ origin: "string" })` always echoes the configured value regardless of the request origin — it does not actually restrict access. The callback correctly returns `false` for non-matching origins. If multiple origins are ever needed, the callback can be extended to check against an array.

Alternative: wildcard `"*"` — rejected because it would negate the hardening entirely.

**D2 — `"1mb"` string via Express / bytes library rather than a numeric byte count**

Express passes the `limit` option to the `bytes` package internally. The string form `"1mb"` is more readable and self-documenting than `1_048_576`. There is no behavioural difference.

**D3 — Tests use supertest against the app module without a running database**

CORS headers and body-size limits are enforced by middleware before any route handler is reached. Supertest + the app module is sufficient; no MongoDB connection is needed, making the tests fast and CI-safe.

**D4 — `FRONTEND_URL` env var with `"http://localhost:3001"` default**

Reading from `process.env.FRONTEND_URL` at module load time (when `dotenv.config()` has already been called) means no restart logic is needed. The default ensures the development workflow works out-of-the-box without any `.env` change.

## Risks / Trade-offs

- [Risk] A large legitimate payload (e.g., bulk import) could be blocked by the 1 MB limit.  
  → Mitigation: 1 MB is generous for a meeting-management app. If a bulk-import endpoint is added later, a separate route-level limit can be applied.

- [Risk] `FRONTEND_URL` misconfiguration in production blocks the frontend entirely.  
  → Mitigation: The default covers development; production deployments should validate the env var in CI/CD.

- [Risk] The wrong-origin test asserts `toBeUndefined()` — if the cors package ever changes its "no header" behaviour, the assertion will still pass for wrong reasons.  
  → Mitigation: The correct-origin test provides the positive assertion; together they cover the meaningful cases.
