## Why

The Express server has no security headers, no rate limiting, no request logging, and leaks internal error details to clients — all of which are baseline security hygiene gaps identified in OWASP A05:2021 (Security Misconfiguration). These must be closed before any feature work ships to avoid introducing a vulnerable API.

## What Changes

- Add `helmet` middleware to set secure HTTP response headers (X-Content-Type-Options, X-Frame-Options, X-DNS-Prefetch-Control, etc.)
- Add `express-rate-limit` middleware on all `/api/` routes — 100 requests per 15 minutes per IP
- Add `morgan` request logging middleware (combined format in production, dev format otherwise)
- Add a global error handler in `app.ts` that returns generic 500 messages for unknown errors and correct status codes for operational `AppError` instances — **stopping error.message and stack traces from leaking to clients**
- Create `AppError` utility class for operational errors (404, 400, etc.)
- Create `asyncHandler` utility wrapper to eliminate try/catch boilerplate in controllers
- Refactor `meetingController.ts` to use `asyncHandler` — remove raw `req: any, res: any` types and explicit try/catch

## Capabilities

### New Capabilities

- `security-headers`: Helmet middleware applies secure HTTP headers on every response
- `api-rate-limiting`: express-rate-limit enforces per-IP request quotas on all API routes
- `request-logging`: Morgan middleware logs all inbound requests for audit visibility
- `global-error-handling`: Centralized error handler prevents information disclosure and standardizes error responses
- `async-error-handling`: asyncHandler utility and AppError class provide a clean error propagation pattern for controllers and services

### Modified Capabilities

<!-- None — no existing specs are changing requirements -->

## Impact

- `server/package.json` — new runtime deps: `helmet`, `express-rate-limit`, `morgan`; new dev dep: `@types/morgan`
- `server/src/app.ts` — wires new middleware and global error handler
- `server/src/controllers/meetingController.ts` — refactored to use asyncHandler; removes error information disclosure bug
- New files: `server/src/utils/AppError.ts`, `server/src/utils/asyncHandler.ts`
- New test file: `server/src/__tests__/security-hardening.test.ts`
- All subsequent BE controllers and services must use `asyncHandler` and `AppError` respectively
