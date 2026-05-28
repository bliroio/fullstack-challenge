# Bliro Full-Stack Challenge — Submission

> Submission branch: `submission_fabian-emilius`

## TL;DR

A 90-minute timebox, of which the first **~45 minutes evaporated on setup**: the MongoDB Atlas cluster listed in the challenge PDF (`cluster0.hhh3bpb.mongodb.net`) was dead at the DNS level, so I had to diagnose that, stand up a local Mongo via Docker Compose, and rework the project to actually be configurable rather than depending on a hardcoded host. That left ~45 minutes for the actual feature work.

To get a meaningful release out in that window I leaned on an **AI-assisted workflow** — generating, iterating, and reviewing code at a higher pace than I'd usually run, with the explicit trade-off that the generated code didn't always get a refactor pass before the next change landed. If the release had gone live, my next sprint would have been a code-cleanup pass over the touched surface (consolidating styling, deduplicating types between client and server, tightening validation, adding tests around the business logic). The bias here was visibly correct over locally elegant.

**Main outcomes within the window:**

1. **App is actually deployable to production** — env-driven URLs, CORS allowlist, working Dockerfiles for client and server, full `docker-compose.yml` orchestrating all three containers.
2. **Database no longer self-destructs on every startup** — seeding moved into dedicated, idempotent scripts triggered explicitly via `npm run db:seed`, `npm run db:reset`, and `npm run db:create-room`.
3. **Multi-room support as required by the brief** — `Room` model, required `roomId` reference on `Meeting`, `GET /api/rooms`, room selector in the create drawer, meeting list grouped by room in a responsive grid.
4. **Create functionality wired end-to-end** — `POST /api/meetings` shipped (it didn't exist before), the previously dead Create button now works, and the form's default `endTime` bug (which left Save permanently disabled) is fixed.

## Setup

```bash
# 1. Bring up MongoDB locally (the challenge's Atlas URL no longer resolves)
docker compose up -d mongo

# 2. Server
cd server && cp .env.example .env && npm install && npm run dev

# 3. Client (in a second terminal)
cd client && cp .env.local.example .env.local && npm install && npm run dev

# 4. Optional: seed mock rooms + meetings
cd server && npm run db:seed

# Open http://localhost:3001
```

Or run the whole stack containerised:

```bash
docker compose up -d --build           # mongo + server + client
docker compose exec server node dist/scripts/seedDb.js   # seed
```

An Atlas connection string can be dropped into `server/.env` instead of using local Mongo — both SRV and standard formats are documented in `server/.env.example`.

## Gap analysis (what I found on day one)

| Severity | Area                              | Issue                                                                                                 | Addressed? |
|----------|-----------------------------------|-------------------------------------------------------------------------------------------------------|------------|
| **P0**   | server/db.ts                      | DB wiped + reseeded with 100 dummies on every startup — destroys any user data                        | ✅ |
| **P0**   | server                            | No `POST /api/meetings` endpoint; the client's Create button hit a 404                                | ✅ |
| **P0**   | data model                        | Brief mentions meeting **rooms** but the model has no `roomId`                                        | ✅ |
| **P0**   | infra                             | Provided MongoDB Atlas URL returns NXDOMAIN from its authoritative nameserver                         | ✅ (Docker) |
| **P0**   | config                            | Missing `.env.example` files; URLs hardcoded — undeployable as-is                                     | ✅ |
| **P1**   | client/header.tsx                 | Search field had no handler, value, or API wiring                                                     | ✅ (removed) |
| **P1**   | client/form                       | Create form Save button silently disabled — `endTime` defaulted equal to `startTime`                  | ✅ |
| **P1**   | server/controllers                | `any`-typed handlers; raw `error.message` echoed to clients                                           | ✅ |
| **P1**   | server                            | No overlap protection — nothing stops two meetings booking the same room at the same time             | ❌ (deferred) |
| **P1**   | server/services/meetingService.ts | Unescaped user input fed to `new RegExp(...)` — ReDoS risk on the search filter                       | ❌ (moot — search dropped) |
| **P2**   | server                            | No `/health` endpoint, no graceful shutdown                                                           | ❌ |
| **P2**   | client                            | No loading / error states on the meeting list                                                         | ⚠️ partial (empty state only) |
| **P3**   | both                              | No tests, no CI, no shared types package, no auth                                                     | ❌ |

## What I actually shipped

### Setup, configurability, and deployability
- Added the missing `server/.env.example` and `client/.env.local.example`.
- Removed all hardcoded URLs: client reads `NEXT_PUBLIC_API_BASE_URL`; server's Swagger + startup log use `API_BASE_URL`; CORS honors an optional comma-separated `CORS_ORIGIN` allowlist.
- `docker-compose.yml` with three services (`mongo`, `server`, `client`), healthcheck-gated startup, and a persistent volume for Mongo.
- Multi-stage `Dockerfile`s for both server and client (Next.js `output: "standalone"` so the runtime image stays small). `NEXT_PUBLIC_API_BASE_URL` plumbed in as a build arg because Next bakes it into the browser bundle.
- `.dockerignore` files to keep the build context lean.

### Database lifecycle
- Removed the destructive `resetDatabase()` from server startup.
- Three explicit scripts:
  - `npm run db:reset` — wipes both `meetings` and `rooms`.
  - `npm run db:seed` — inserts 5 mock rooms + 100 meetings (no-op if either collection already has data).
  - `npm run db:create-room -- "<name>" <capacity>` — CLI for ad-hoc room creation with validation (duplicate name, non-positive capacity).

### Rooms (per the brief)
- New `Room` Mongoose model (`name` unique, `capacity` positive integer).
- Required `roomId` reference on `Meeting`, indexed for per-room queries.
- `GET /api/rooms` (controller + service + Swagger schema).
- `POST /api/meetings` validates the `roomId` is a real ObjectId and references an existing room.

### Create meeting end-to-end
- `POST /api/meetings` implemented from scratch: typed `Request`/`Response` handler, `ValidationError` for non-empty title, parseable ISO timestamps, `endTime > startTime`, valid `roomId`. Returns `201` on success, `400` on validation failure, generic `500` otherwise (no internal message leakage).
- Client wired through to the new endpoint with room selector in the drawer.
- Fixed the silent **Save-disabled bug**: form now defaults `endTime` to `startTime + 1h` instead of both being `new Date()`, and auto-bumps `endTime` whenever the user moves `startTime` past it.

### UI improvements
- Removed the broken search field from the header — searching meetings by text isn't a real product surface here.
- Replaced the flat "My Meetings" list with a **responsive grid grouped by room** (`xs=12 / sm=6 / md=4 / lg=3`). Each column shows the room name, capacity, booking count, and sorted meetings — empty rooms render a placeholder.
- Meeting cards display the room name via a `roomId → name` lookup map.

## What I deliberately didn't ship

| Skipped | Why |
|---|---|
| **Overlap protection** (preventing two meetings in the same room at the same time) | Originally planned as a P1; the cleanup-vs-time trade-off pushed it out. Easiest win for the next iteration — see below. |
| Tests / CI | Out of budget; better to ship correct user-facing behavior than thin coverage |
| Full zod schemas for every request | Basic inline checks were enough for this surface; introducing zod was a refactor, not a bugfix |
| Pagination UI | Server already supports it; flat list of 100 is fine for this dataset |
| Auth / user accounts | Out of scope per the brief, and a prerequisite for several of the recommendations below |
| Shared types package between client and server | Refactor overhead disproportionate to ~two duplicated types — would be the first cleanup target post-release |
| `/health` endpoint, graceful shutdown | Production-hardening polish, not user-facing |
| Cosmetic MUI deprecations (`InputProps` → `slotProps`) | No behavior impact |

## Recommended next iterations

The cleanup pass and product additions I'd queue next, roughly in priority:

1. **Code cleanup pass.** Consolidate the duplicated `Meeting`/`Room` types between client and server (shared package or generated types from the OpenAPI spec). Pull repeated MUI `sx` blocks out of `header.tsx`/form components into a theme or a few styled components. Tighten loose typing in services.
2. **Per-room overlap protection.** `POST /api/meetings` should reject overlapping bookings in the same room with `409 Conflict` and the form should surface it. The compound `(roomId, startTime)` query is cheap; this is the highest-value piece of business logic still missing.
3. **Quantised time slots.** Start times restricted to `:00 / :15 / :30 / :45` and durations chosen from presets (30 min / 1 h / 2 h) rather than free-form `DateTimePicker`s. Removes a whole category of "I picked 14:37" mistakes.
4. **Organiser identity.** Capture the name of who created each meeting. Trivial as a free-text field today; properly belongs behind auth so it can't be spoofed.
5. **Cancel a meeting.** `DELETE /api/meetings/:id` plus a cancel action on each card — deliberately skipped today because without auth and an "owner", *anyone* can cancel *anyone's* meeting, which is worse than not having the feature.
6. **Tests** around the create + overlap logic specifically (the highest-value, easiest-to-regress business code).
7. **`/health` endpoint + graceful shutdown** for real deploy environments.

## Approach note

Because of the genuinely tight window — and the fact that ~half of it was eaten by infrastructure that didn't work as advertised — I leaned on an AI-assisted workflow to keep up the pace. The trade-off was conscious: I prioritised shipping a working, configurable, multi-room app over hand-polishing every file. The code is functional and the architecture is clean enough, but a code-cleanup pass (consolidating styling, deduplicating types between client and server, tightening light validation into proper schemas, and adding test coverage) would be the first thing I'd do once the release was out. Treat this submission as the "ship the release" stage, with the refactor sprint queued behind it.

## Assumptions

- "Production-ready release" means *good enough that a real user can use it without hitting obvious failure modes*, not "passes a SOC2 audit."
- The brief's "meeting rooms" warrants at least a minimal `Room` entity. I introduced rooms via a fixed seed list + a CLI for ad-hoc creation rather than a rooms-management UI — admin CRUD over rooms felt like a separate product surface.
- Overlap is defined per-room: two meetings in different rooms can run concurrently, two in the same room cannot. Enforcement of this is queued for the next iteration.
- Reset-on-startup was developer convenience, not a product requirement. Seeding still exists but only runs against empty collections, and only when invoked explicitly.
- Local MongoDB via Docker is acceptable because the provided Atlas URL no longer resolves. The submission runs against any Mongo by overriding `MONGODB_URI`.
- `_id` is used directly on the client for entity ids (rather than mapping it to `id`) — matches Mongo's native shape and avoids a server-side `toJSON` transform.
