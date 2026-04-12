# YouWork Meeting Room Management — Report

## Overview

This report documents the work done on the YouWork Meeting Room Management application — a Next.js 15 + Express 4 + MongoDB stack for managing meeting room bookings.

### Starting State

The application had a meeting list page with cards, a create meeting drawer/form, a `GET /api/meetings` endpoint with pagination, Swagger docs at `/api-docs`, and an MUI-themed UI with orange branding. Under the surface, nearly every user-facing flow was broken:

- **Database wiped on every server restart** — `resetDatabase()` called unconditionally inside `connectDB()`
- **No POST endpoint** — the create meeting form submitted to nothing (404)
- **`_id`/`id` mismatch** — Mongoose returned `_id` (ObjectId), frontend expected `id` (string) — undefined everywhere
- **Regex injection** — raw user input passed directly to `new RegExp()`, crashing the server on metacharacters
- **Search bar was decorative** — no `onChange` handler wired
- **No loading, error, or empty states** — blank page during fetch, silent failures
- **11 CVEs in dependencies** — including CVE-2025-66478 (Next.js RCE, CVSS 10.0)
- **Schema defined in 5 places** — Mongoose model, server interface, two Swagger definitions, and client interface — all drifting from each other
- **Form bugs** — no per-field errors, no double-submit prevention, start/end time both default to `new Date()` (submit disabled with no explanation)
- **Zero input validation** — `req: any, res: any` on every controller, no body size limit, CORS wide open, no security headers

---

## Methodology

### Exploration

The first step was a full codebase audit: read every file, trace the request flow end-to-end, run `npm audit`, and attempt a `next build`. This revealed that the request pipeline had no separation between input validation, request orchestration, and business logic — raw `req.query` flowed from the route straight into MongoDB with zero checks. It also uncovered a critical structural problem: the Meeting concept was defined in 5 separate places (Mongoose schema, server TypeScript interface, Swagger JSON in config, Swagger YAML in route JSDoc, and client TypeScript interface), all drifting from each other.

### Analysis

Every issue was catalogued and classified into five categories:

- **Immediate breakers (7)** — app crashes or core features dead (DB wipe on restart, no POST endpoint, `_id`/`id` mismatch, regex injection, form submitting to 404, broken React keys, decorative search bar)
- **Security vulnerabilities (17)** — open CORS, no body limit, NoSQL injection, no input validation, no security headers, no rate limiting, error message leakage, no request logging, no frontend security headers, no API response validation, and 11 CVEs across dependencies
- **UX gaps (10)** — no loading/error/empty states, wrong sort order, no pagination UI, no delete/edit, no success feedback, hardcoded API URL
- **Code quality / debt (11)** — invalid fallback URI, no schema validation, no indexes, Swagger only works post-build, duplicate providers, theme issues, broken `next build`, Zod installed but unused
- **Form hook bugs (5)** — no double-submit prevention, no field-level errors, non-null assertion on nullable, full re-render on every keystroke, start/end same time on open

### Prioritization (MoSCoW)

Issues were prioritized using MoSCoW:

- **Must Have** (release blockers) — all 7 breakers, all security vulnerabilities, core UX gaps (loading/error/empty, search, form rewrite, sort order), schema unification, and the broken `next build`. These formed Phases 0–2.
- **Should Have** (quality) — success toast, env var for API URL, Swagger rewrite, delete functionality. Phase 3.
- **Could Have** (deferred) — pagination UI, edit meeting, database index, realistic seed data. Phase 4.
- **Won't Have** (out of scope) — authentication, CSRF, CSP, multi-room support, recurring meetings, calendar view, email notifications, dark mode.

### Implementation

The strategy was **fix with tools, not more code**: Zod 4 was already installed but unused, Mongoose 8's `toJSON` transform was a built-in that just needed configuration. Where new tools were needed (`react-hook-form`, `helmet`, `express-rate-limit`, `morgan`), they replaced hand-rolled code rather than adding to it.

Key architectural decisions:

1. **Single source of truth** — one Zod schema in `shared/schemas/meeting.ts` from which TypeScript types, server validation, and client form validation all derive
2. **Defense-in-depth pipeline** — five layers of injection protection (sanitize middleware, Zod `.strict()`, `escapeRegExp`, Mongoose `sanitizeFilter`, Mongoose `strictQuery`)
3. **TDD + property-based testing** — tests written before implementation; fast-check generates hundreds of cases automatically to verify schemas and endpoints handle arbitrary input
4. **Security before features** — attack surface locked down before any new endpoints were added

### Release

The definition of shippable was defined upfront as a checklist covering functional requirements (19 items) and test coverage requirements (10 items). Key acceptance criteria:

- Zero critical/high vulnerabilities in `npm audit`
- Server starts without seeding or destroying data
- Full CRUD lifecycle works end-to-end (create, read, search, delete, edit)
- Per-field validation errors on both client and server
- NoSQL injection neutralized through 5 defense layers
- CORS restricted to frontend origin only
- All four page states work (loading, data, empty, error)
- `npm test` passes in both server and client with property-based, component, and integration tests

---

## What Was Done

### Phase 0 — Foundation (7 tasks)

Established a stable, secure, testable base before any feature work.

| Task                     | What Changed                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Audit deps, fix CVEs** | Patched 11 vulnerabilities across both packages. Next.js 15.4.4 → 15.5.15 (CVE-2025-66478, CVSS 10.0 RCE), axios 1.6.2 → 1.15.0 (4 CVEs), express 4.18.2 → 4.22.1 (ReDoS + DoS), mongoose to 8.9.5+ (CVE-2025-23061 query injection). All patches within `^` semver range — no breaking changes.                                                                       |
| **Environment examples** | Added `server/.env.example` and `client/.env.local.example` so new developers can set up without guessing required variables.                                                                                                                                                                                                                                          |
| **Extract seed script**  | Decoupled database seeding from app startup. Previously, `connectDB()` called `resetDatabase()` on every boot, destroying all data unconditionally. Now seeding is an explicit `npm run seed` command. The server connects to MongoDB without side effects.                                                                                                            |
| **Server test setup**    | Configured Vitest + Supertest + fast-check for the server. Property-based testing infrastructure ready for schema and endpoint validation.                                                                                                                                                                                                                             |
| **Client test setup**    | Configured Vitest + React Testing Library + MSW + fast-check for the client. MSW intercepts network requests at the service worker level, enabling full integration tests without a running backend.                                                                                                                                                                   |
| **Configure Mongoose**   | Added `toJSON` transform (`_id` → `id`, `__v` removed), enabled `sanitizeFilter` (wraps `$` operators in `$eq` as defense-in-depth), set `strictQuery` (drops unknown filter fields), added fail-fast on missing `MONGODB_URI`, and added schema-level `endTime > startTime` validation.                                                                               |
| **Shared Zod schemas**   | Created `shared/schemas/meeting.ts` as the single source of truth for the Meeting type. All TypeScript types, server validation, client form validation, and API response parsing derive from this one file. Added npm workspaces (`client`, `server`, `shared`) so both packages resolve `shared/...` imports naturally. Backed by property-based tests (fast-check). |

### Phase 1 — Backend Security (6 tasks)

Locked down the attack surface before adding any new endpoints.

| Task                           | What Changed                                                                                                                                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Security hardening**         | Added `helmet` (security headers), `express-rate-limit` (100 req/15min per IP on `/api/`), `morgan` (request logging), and a global error handler that returns structured errors without leaking internals.               |
| **NoSQL sanitizer middleware** | Built a zero-dependency ~20-line middleware that strips `$` and `.` prefixed keys from `req.body`, `req.query`, and `req.params`. Replaces the unmaintained `express-mongo-sanitize` package.                             |
| **Validation middleware**      | Created a reusable `validate()` middleware powered by Zod `.strict()` schemas. Rejects unknown keys, coerces types, enforces bounds (page >= 1, limit clamped to 1–100), and returns structured per-field error messages. |
| **Harden service**             | Replaced raw `new RegExp(user_input)` with explicit `escapeRegExp()` utility. The service now constructs typed, sanitized MongoDB queries — no user input reaches a query operator directly.                              |
| **Wire GET validation**        | Applied the Zod validation middleware to `GET /api/meetings`. Query parameters are now parsed, coerced, bounded, and validated before reaching the controller.                                                            |
| **CORS + body limit**          | Configured CORS to accept only the frontend origin (configurable via env var). Set `express.json()` body limit to 10kb to prevent payload bombs.                                                                          |

### Phase 2 — Backend Features (3 tasks)

| Task                | What Changed                                                                                                                                                                                                                                                         |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **POST endpoint**   | Implemented `POST /api/meetings` with full Zod validation. Returns 201 with the created meeting on success, 400 with structured field errors on invalid input. Property-based tests verify the endpoint accepts any valid meeting shape and rejects any invalid one. |
| **Sort order fix**  | Changed meeting sort from `startTime DESC` to `ASC` — upcoming meetings now appear first instead of being buried at the bottom.                                                                                                                                      |
| **DELETE endpoint** | Added `DELETE /api/meetings/:id` returning 204 on success, 404 if not found. Client-side delete button added to meeting cards with confirmation.                                                                                                                     |

### Phase 3 — Frontend (8 tasks)

| Task                                      | What Changed                                                                                                                                                                                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Fix client build**                      | Split root layout into a server-side layout (`<html>`/`<body>`) and a client-side `Providers` component. The original `"use client"` on the root layout prevented Next.js from pre-rendering error pages, breaking `next build`.                             |
| **Frontend security**                     | Added security headers via `next.config.js` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). Added Zod-based API response validation so the client doesn't blindly trust server data.                                         |
| **Update client deps**                    | Installed `react-hook-form`, `@hookform/resolvers`, and `zod` on the client. Removed the old hand-rolled `Meeting` TypeScript interface — types now come from the shared Zod schemas.                                                                        |
| **Form rewrite**                          | Replaced the 102-line hand-rolled `useCreateMeetingForm` hook with `react-hook-form` + `zodResolver`. The new form shows per-field validation errors, prevents double-submit, defaults `endTime` to 1 hour after `startTime`, and resets properly on cancel. |
| **Wire search**                           | Connected the search `<TextField>` in the header with an `onChange` handler, debounced input, and wired it to filter `GET /api/meetings?title=...`. Search results update as the user types.                                                                 |
| **Loading/error/empty states**            | Added a loading spinner while meetings fetch, an error alert when the API is unreachable, and a meaningful empty state when no meetings match the current filters. Backed by integration tests using MSW to simulate all four states.                        |
| **Remove duplicate LocalizationProvider** | Removed the redundant `<LocalizationProvider>` wrapper from `CreateMeetingDrawer` — it was already provided at the layout level.                                                                                                                             |
| **Env var for API URL**                   | Replaced the hardcoded `http://localhost:3000` in `meetingService.ts` with a `NEXT_PUBLIC_API_URL` environment variable, making the API base URL configurable per environment.                                                                               |

### Phase 4 — Extra Features (2 tasks)

| Task              | What Changed                                                                                                                                                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pagination UI** | Added pagination controls to the meeting list. The frontend now respects the backend's paginated response (`totalDocs`, `totalPages`, `page`, `limit`) and renders page navigation. No longer silently drops meetings beyond a hardcoded limit. |
| **Edit meeting**  | Added `PUT /api/meetings/:id` endpoint with full Zod validation. Client-side edit button opens the form drawer pre-filled with the meeting's current values. Submit updates the meeting in place.                                               |

---

## Architecture Decisions

### Single Source of Truth for Meeting Schema

The original codebase defined the Meeting concept in 5 separate places — all drifting from each other. Adding a field required editing 7 files.

The fix: one Zod schema in `shared/schemas/meeting.ts` from which everything derives:

```
shared/schemas/meeting.ts          <- Zod schema (SINGLE SOURCE)
  |
  |---> z.infer<typeof>             -> TypeScript types (client + server)
  |---> createMeetingSchema.parse() -> Server-side POST validation
  |---> zodResolver()               -> Client-side form validation

server/src/models/meeting.ts       <- Mongoose schema (compatible mirror)
  |---> toJSON transform             _id -> id, omit __v
  |---> endTime > startTime          defense-in-depth duplicate of Zod rule
```

Adding a field now requires editing 2-3 files instead of 7.

**Why Mongoose doesn't import from Zod:** There is no reliable way to auto-generate a Mongoose schema from Zod. The duplication is small (3 fields) and the tradeoff is worth it vs. a fragile auto-conversion layer.

### Defense-in-Depth Request Pipeline

```
helmet -> morgan -> rate-limit -> cors -> express.json(10kb) -> sanitize -> Zod .strict() -> Controller -> Service -> Mongoose(sanitizeFilter + strictQuery)
```

Five layers protect against injection:

1. **Sanitize middleware** — strips `$`/`.` keys from request data
2. **Zod `.strict()`** — rejects unknown keys, coerces and bounds values
3. **`escapeRegExp`** — neutralizes regex metacharacters in search input
4. **Mongoose `sanitizeFilter`** — wraps surviving `$` operators in `$eq`
5. **Mongoose `strictQuery`** — drops filter fields not in the schema

### Testing Strategy

- **Property-based tests** (fast-check): Schema validation, POST endpoint, GET query params — hundreds of auto-generated cases verify the system handles arbitrary input correctly.
- **Integration tests** (MSW): Client-side tests intercept network requests at the service worker level, testing the full loading -> data -> empty -> error lifecycle without a running backend.
- **Component tests** (React Testing Library): Form validation, double-submit prevention, search debouncing.

---

## What Was Not Done

Items deprioritized or deferred:

- **Swagger rewrite** — existing docs not updated to reflect new endpoints (POST, DELETE, PUT)
- **Success toast** after meeting creation — deferred in favor of higher-impact features
- **`startTime` database index** — minor optimization for the current data volume
- **Realistic seed data** — cosmetic improvement
- **Authentication / authorization** — no auth system exists; adding one is a separate effort
- **CSRF protection** — no sessions to protect without auth
- **Content Security Policy** — requires `unsafe-inline` for MUI's style injection; high effort, low risk
- **Calendar view, recurring meetings, email notifications, dark mode** — out of scope

---

## Commit History

25 atomic commits on the `submission_backend` branch, each corresponding to one discrete task:

1. **ALL-000 → ALL-006** — Foundation (deps, env, seed, tests, mongoose, shared schemas)
2. **FE-000 → FE-006** — Frontend (build fix, security, deps, form, search, states, cleanup)
3. **BE-000 → BE-008** — Backend (security hardening, sanitizer, validation, service hardening, endpoints, CORS, sort, delete)
4. **XTR-001 → XTR-002** — Extras (pagination, edit meeting)

Security work was committed before feature work in both tracks. Each commit is independently reviewable.
