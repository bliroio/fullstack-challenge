## Context

`client/app/services/meetingService.ts` is the single file that issues all HTTP requests from the Next.js frontend to the Express backend. It currently hardcodes the full resource URL `http://localhost:3000/api/meetings` as `API_BASE_URL`. Every function that constructs a URL either uses that constant directly or appends an `/<id>` suffix to it.

The change is purely mechanical: split the constant at the resource boundary so that `API_BASE_URL` holds only the origin + prefix (`/api`), and each call site appends the resource path itself.

## Goals / Non-Goals

**Goals:**
- Allow `NEXT_PUBLIC_API_URL` to override the base URL at build/runtime without code changes
- Keep the local-dev default (`http://localhost:3000/api`) so no `.env` file is required
- Leave all exported function signatures and return types unchanged

**Non-Goals:**
- Adding `.env` or `.env.local` files
- Changing any other client files
- Introducing a new HTTP client or abstraction layer
- Handling trailing-slash normalisation (callers supply clean paths)

## Decisions

**Decision: append `/meetings` at each call site rather than a helper function**

The service has only four exported functions and no shared path-building logic. Inlining `/meetings` at each call site keeps the change minimal and easy to review. A `buildUrl` helper would add indirection for no practical benefit at this scale.

**Decision: `process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"` — no validation**

Runtime validation of the env var (e.g. asserting it is a valid URL) is out of scope. The fallback is identical to the current hardcoded host+prefix, so the default behaviour is unchanged.

## Risks / Trade-offs

- [Risk] A consumer sets `NEXT_PUBLIC_API_URL` with a trailing slash, producing `//meetings` double-slash URLs → Mitigation: document that the variable must not have a trailing slash (noted in PLANS/FE-008). TypeScript will not catch this at compile time; it is an operator error.
- [Risk] Future resources added to the service forget to append their path and reuse `API_BASE_URL` bare → Mitigation: the variable name (`API_BASE_URL`) makes clear it is a base, not a resource URL; code review catches this.
