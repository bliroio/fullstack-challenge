## Why

The Express server currently accepts requests from any origin and has no body size limit, leaving it exposed to cross-origin abuse and oversized-payload attacks. Tightening CORS to the known frontend origin and capping JSON body ingestion at 1 MB closes these two low-effort, high-impact attack surfaces before the app is deployed.

## What Changes

- `app.use(cors())` → `app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3001" }))` — restricts the `Access-Control-Allow-Origin` response header to the configured frontend origin only.
- `app.use(express.json())` → `app.use(express.json({ limit: "1mb" }))` — Express returns HTTP 413 for any request body exceeding 1 MB before it reaches any route or middleware.
- New test file `server/src/__tests__/security.test.ts` — vitest + supertest tests that verify CORS and body-limit behavior without requiring a database connection.

## Capabilities

### New Capabilities

- `cors-origin-restriction`: CORS is restricted to a configurable frontend origin; requests from other origins do not receive `Access-Control-Allow-Origin`.
- `body-size-limit`: The server rejects JSON request bodies larger than 1 MB with HTTP 413.

### Modified Capabilities

<!-- No existing spec-level requirements are changing; this is additive hardening. -->

## Impact

- **`server/src/app.ts`**: two one-line edits (cors options, express.json limit).
- **`server/src/__tests__/security.test.ts`**: new test file (no DB required).
- **No API contract changes**: existing routes, request/response shapes, and error formats are unchanged.
- **No new dependencies**: `cors` and `express` are already installed.
- **Environment**: production deployments must set `FRONTEND_URL` to the real frontend URL.
