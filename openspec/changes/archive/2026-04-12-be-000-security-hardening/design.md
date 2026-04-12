## Context

The Express server (`server/src/app.ts`) currently has no security middleware beyond CORS. Controller error handling is ad-hoc — `meetingController.ts` uses `res.status(500).json({ message: error.message })` which leaks internal database error messages to clients. There is no request logging and no rate limiting. This is the first BE task and establishes patterns for all subsequent controller and service work.

## Goals / Non-Goals

**Goals:**
- Apply `helmet` for secure HTTP headers with its safe defaults
- Apply `express-rate-limit` on all `/api/` routes (100 req / 15 min / IP)
- Apply `morgan` for request logging (combined in production, dev otherwise)
- Centralize error handling in a single `ErrorRequestHandler` in `app.ts`
- Establish `AppError` + `asyncHandler` as the error propagation pattern for all controllers
- Refactor the existing `listMeetings` controller to use the new pattern
- Write a test that covers security headers and error non-disclosure

**Non-Goals:**
- Authentication or authorization (later BE tasks)
- HTTPS/TLS termination (handled at infrastructure level)
- CSP tuning for Swagger UI (deferred to BE-009)
- HPP (HTTP Parameter Pollution) protection — Zod validation already rejects malformed params

## Decisions

### D1: Use `helmet()` defaults

Helmet v7+ provides safe defaults covering 11 security headers. The proposal references OWASP A05 — defaults satisfy all required headers without manual configuration. Swagger UI may have CSP issues in development; if so, BE-009 will scope a CSP exemption to the `/api-docs` route only.

**Alternative considered**: Manually setting individual headers with `res.set()`. Rejected — brittle, maintenance burden, easy to miss headers when Express upgrades.

### D2: Rate limit on `/api/` prefix, not globally

Helmet and Morgan should apply globally (all routes including `/api-docs`). Rate limiting is scoped to `/api/` because Swagger UI makes many requests when loading and would hit the limit in development. The limit of 100 req / 15 min is conservative but appropriate for an API — adjustable via env var in a later task.

**Alternative considered**: Global rate limit. Rejected — Swagger UI UX would degrade in development.

### D3: `ErrorRequestHandler` typed global error handler

Express 4 requires the 4-argument `(err, req, res, next)` signature for error middleware. Using the `ErrorRequestHandler` type from `@types/express` enforces this at compile time. The handler checks `res.headersSent` before responding to handle streaming edge cases safely.

**Alternative considered**: Per-controller try/catch. Rejected — already exists, leaks error details, adds boilerplate to every handler. The existing `catch (error: any) { res.status(500).json({ message: error.message }) }` is the exact bug being fixed.

### D4: `asyncHandler` wrapper over Express 5 upgrade

Express 5 auto-catches async errors; Express 4 does not. Upgrading to Express 5 would require testing all middleware compatibility. A thin `asyncHandler` wrapper (`Promise.resolve(fn).catch(next)`) achieves the same result with zero upgrade risk and can be removed transparently when Express 5 is adopted.

### D5: `AppError` for operational errors only

Only errors thrown as `new AppError(statusCode, message)` return their message to the client. All other errors (DB errors, unexpected exceptions) return a hardcoded `"Internal server error"` string. This is the security fix — no internal detail leaks, regardless of what the error contains.

## Risks / Trade-offs

- [Risk] Helmet's default CSP may break Swagger UI assets in development → **Mitigation**: Accepted for now; if it breaks, BE-009 adds `helmet({ contentSecurityPolicy: false })` scoped to `/api-docs`.
- [Risk] Rate limit of 100/15min may be too low for integration tests that fire many requests → **Mitigation**: Tests can use `supertest` directly (bypasses the IP-based limiter since it uses a loopback address); tests calling a live server must be aware of the limit.
- [Risk] Morgan logs in test output may be noisy → **Mitigation**: Morgan writes to `stdout`; test runner output is separate and tests are not affected by logs.

## Migration Plan

1. Install new packages (`npm install`).
2. Apply code changes.
3. Run `npm run build` — verify no TypeScript errors.
4. Run test suite — `security-hardening.test.ts` should pass.
5. No data migration required — purely additive middleware changes.
6. Rollback: revert `app.ts` and `meetingController.ts`; remove utility files; `npm uninstall` new packages.

## Open Questions

- None. All decisions are resolved above.
