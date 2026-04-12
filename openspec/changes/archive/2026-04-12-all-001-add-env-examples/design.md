## Context

The server and client each use environment variables for configuration (MongoDB URI, port, CORS origin, API base URL). There are currently no `.env.example` or `.env.local.example` files, so new developers have no reference for what variables to set. The root `.gitignore` excludes `.env` and `.env.local` but does not exclude `.env.example` or `.env.local.example`, meaning the example files will be tracked by git safely.

## Goals / Non-Goals

**Goals:**
- Create `server/.env.example` documenting all server environment variables with placeholder or default values.
- Create `client/.env.local.example` documenting all client environment variables with placeholder or default values.
- Both files committed to git as the canonical on-boarding reference.

**Non-Goals:**
- Changing any runtime code to consume new environment variables.
- Adding env-validation libraries (e.g., `zod`, `envalid`) — that is a future task.
- Documenting CI/CD or deployment-specific secrets.

## Decisions

**File naming follows each project's stated convention:**
- `server/.env.example` — matches the copy instruction in `server/README.md` (`cp .env.example .env`).
- `client/.env.local.example` — matches the Next.js convention referenced in `client/README.md` (`cp .env.local.example .env.local`).

**Variables to document:**
- Server: `MONGODB_URI` (required), `PORT` (optional, default 3000), `NODE_ENV` (optional, default development), `FRONTEND_URL` (optional, default http://localhost:3001), `SEED_DB` (optional, commented out).
- Client: `NEXT_PUBLIC_API_URL` (optional, default http://localhost:3000/api). The `NEXT_PUBLIC_` prefix is required by Next.js to expose variables to the browser.

**MONGODB_URI placeholder value:** `[MY_PERSONAL_ACCESS_KEY]` — clearly non-functional, signals that the developer must supply their own value. No real connection string is committed.

## Risks / Trade-offs

- [Risk] Variables added in future tasks may not be reflected in the example files → Mitigation: each future task that adds a new `process.env.*` reference MUST update the relevant example file as part of its own scope.
- [Risk] `SEED_DB` and `NODE_ENV` are not yet referenced in server source (they are intended for a future refactor) → Mitigation: documenting them now is forward-looking and harmless; they are commented out or labeled optional.
