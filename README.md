# Bliro Full-Stack Challenge — Submission

> Submission branch: `submission_fabian-emilius`

## TL;DR

I treated the 90-minute window as a triage exercise: identify what blocks a usable release, ship the must-haves, document the rest honestly. The brief talks about meeting **rooms** (plural), but the data model only has meetings — so a thin room concept plus per-room overlap protection became part of the must-have scope alongside the obvious bugs (missing POST endpoint, data-destroying restart, dead search box).

## Setup

The MongoDB Atlas cluster referenced in the challenge PDF (`cluster0.hhh3bpb.mongodb.net`) returns `NXDOMAIN` from its authoritative AWS nameserver — the cluster no longer exists. To keep the project runnable I added a `docker-compose.yml` for a local MongoDB. The default `.env` values point at it, so the happy path is:

```bash
docker compose up -d mongo            # repo root
cd server && cp .env.example .env && npm install && npm run dev
cd client && cp .env.local.example .env.local && npm install && npm run dev
# open http://localhost:3001
```

An Atlas connection string can be dropped into `server/.env` instead — both SRV and standard formats are documented in `server/.env.example`.

## Gap analysis

| Severity | Area                              | Issue                                                                                        |
|----------|-----------------------------------|----------------------------------------------------------------------------------------------|
| **P0**   | server/db.ts                      | DB wiped + reseeded with 100 dummies on every startup — destroys any user data               |
| **P0**   | server                            | No `POST /api/meetings` endpoint; the client's Create button hit a 404                       |
| **P0**   | data model                        | Brief mentions meeting **rooms** but the model has no `roomId` — every booking shares one global calendar |
| **P0**   | server                            | No overlap protection — once rooms exist, nothing stops two meetings booking the same room at the same time |
| **P0**   | client/header.tsx                 | Search field has no handler, value, or API wiring                                            |
| **P1**   | server/services/meetingService.ts | Unescaped user input fed to `new RegExp(...)` — ReDoS risk; special chars crash the endpoint |
| **P1**   | client/page.tsx                   | No loading / empty / error states; `.then(setMeetings)` had no `.catch`                      |
| **P1**   | server/controllers                | `any`-typed handlers; raw `error.message` echoed to clients                                  |
| **P2**   | server                            | Light request validation (timestamps, non-empty title) — basic, not exhaustive               |
| **P2**   | server                            | No `/health` endpoint, no graceful shutdown, no index on `startTime`                         |
| **P2**   | client                            | No pagination UI, no success toast, no a11y labels on search                                 |
| **P3**   | both                              | No tests, no CI, no shared types package, no auth                                            |

## Prioritization

Scoped to ~40 minutes of remaining time after setup and initial analysis. Bias: fix what's *visibly broken* before what's merely *not nice*, and match the product brief before polishing edges.

- **Must** — anything that makes the app appear broken on first use or contradicts the brief: missing POST endpoint, data-destroying restart, no rooms / no overlap protection, dead search field, regex injection that turns search into a 500.
- **Should** — quality wins that take minutes but materially improve the production feel: error states, typed handlers, basic input sanity.
- **Could / Won't** — production hardening that earns more risk than it's worth in <90 min: tests, CI, exhaustive validation schemas, auth, pagination UI.

## What I shipped

### Setup & deployability
- Added the missing `server/.env.example` and `client/.env.local.example` referenced in both READMEs.
- Removed hardcoded URLs: client reads `NEXT_PUBLIC_API_BASE_URL`; server Swagger + startup log use `API_BASE_URL`; CORS honors an optional `CORS_ORIGIN` allowlist.
- Added `docker-compose.yml` (Mongo 7 + persistent volume + healthcheck) so the project runs without the dead Atlas cluster.

### Server
- **Rooms**: introduced a `Room` model and a `roomId` reference on `Meeting`. Seed creates a small fixed set of rooms so the UI has something to render against.
- **`POST /api/meetings`**: required fields (`title`, `roomId`, `startTime`, `endTime`), basic checks for ISO timestamps and `endTime > startTime`.
- **Overlap protection**: server rejects a create that overlaps any existing meeting in the same room (`409 Conflict`).
- **Stopped destroying data on boot**: seeding now runs only when collections are empty.
- **Hardened search**: regex special chars escaped before constructing the filter.
- **Typed controllers** and generic error responses (no `error.message` leakage).
- **Index** on `(roomId, startTime)` for the overlap check and default sort.

### Client
- **Room selector** in the create-meeting drawer; rooms fetched from the API.
- **Wired up the header search** to `?title=` with a 300 ms debounce.
- **Loading / empty / error states** on the meeting list.
- **Conflict feedback**: surfaces the `409` from overlapping bookings inline in the form.

## What I deliberately didn't do

| Skipped | Why |
|---|---|
| Tests / CI | Worth more than the time I had; better to ship correctness than thin coverage |
| Full zod schemas for every request | Basic sanity checks are enough for this surface area; full schema validation is a refactor, not a bugfix |
| Pagination UI | Server already supports it; UI use case is shallow at 100 records |
| Auth / user accounts | Out of scope per the brief; required prerequisite for several of the recommendations below |
| Shared types package | Refactoring overhead disproportionate to one duplicated type |
| Migrating MUI `InputProps` → `slotProps` | Cosmetic deprecation warning, no behavior impact |

## Recommended next iterations (not shipped)

Things I'd queue up for the next sprint. Most are blocked on time or on auth landing first.

- **Quantised time slots.** Start times restricted to `:00 / :15 / :30 / :45` and durations chosen from presets (30 min / 1 h / 2 h) rather than free-form `DateTimePicker`s. Removes a whole category of "I picked 14:37" mistakes and makes overlap collisions much rarer in practice.
- **Organiser identity.** Capture and display the name of the person who created each meeting. Trivial as a free-text field today; properly belongs behind auth so it can't be spoofed.
- **Cancel a meeting.** `DELETE /api/meetings/:id` plus a cancel action on each list item. Deliberately skipped until there's an auth model — without "who owns this booking?" any user can cancel anyone's meeting, which is worse than not having the feature.
- **Room filter on the list view** and a per-room daily/weekly calendar layout — the list is functional but not how people actually consume room schedules.
- **`/health` endpoint + graceful shutdown** for real deploy environments.
- **Tests** around the overlap-detection logic in particular — it's the highest-value piece of business logic and the easiest to regress.

## Assumptions

- "Production-ready release" means *good enough that a real user can use it without hitting obvious failure modes*, not "passes a SOC2 audit."
- The brief's "meeting rooms" warrants at least a minimal `Room` entity. I introduced rooms via a fixed seed list rather than a rooms CRUD UI — admin management of rooms felt like a separate product surface.
- Overlap is defined per-room: two meetings in different rooms can run concurrently; two in the same room cannot.
- Reset-on-startup was developer convenience, not a product requirement. The seeding helper stays but only runs against empty collections so fresh dev environments still get sample data.
- Local MongoDB via Docker is acceptable because the provided Atlas URL no longer resolves. The submission runs against any Mongo by overriding `MONGODB_URI`.

