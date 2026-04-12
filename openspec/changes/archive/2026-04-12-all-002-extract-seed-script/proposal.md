## Why

The server currently wipes and reseeds the entire database on every boot via `resetDatabase()` inside `connectDB()`, making it impossible to persist data across restarts and dangerous in any non-development environment. Seeding logic belongs in an explicit, opt-in command — not on the startup path.

## What Changes

- **CREATE** `server/src/seed.ts` — standalone seed script with two safety guards: blocks when `NODE_ENV=production`, blocks unless `SEED_DB=true` is explicitly set
- **EDIT** `server/src/db.ts` — remove `resetDatabase` function and `Meeting` import; replace silent `|| "fallback_default_mongodb_uri"` with a fail-fast `throw` if `MONGODB_URI` is missing
- **EDIT** `server/package.json` — add `seed` and `seed:clear` npm scripts
- **EDIT** `server/README.md` — remove stale "database is reset" note; document `npm run seed` and `npm run seed:clear` usage

## Capabilities

### New Capabilities

- `database-seeding`: On-demand database seeding via `npm run seed` / `npm run seed:clear`, with production and opt-in guards

### Modified Capabilities

- `env-documentation`: The fail-fast `throw` in `db.ts` and `seed.ts` references `.env.example`, reinforcing the env-var documentation established in ALL-001

## Impact

- `server/src/db.ts`: loses `resetDatabase`, `Meeting` import, and the silent fallback URI — server no longer touches data at startup
- `server/src/seed.ts`: new file added to the TypeScript compilation
- `server/package.json`: two new scripts added (`seed`, `seed:clear`)
- `server/README.md`: developer-facing documentation updated
- No API surface changes; no client-side impact
