## Context

`server/src/db.ts` currently calls `resetDatabase()` inside `connectDB()`, which deletes all meetings and reinserts 100 dummy records on every server boot. This means:
- Data cannot persist across restarts in any environment
- There is no safe way to run the server in staging or production without wiping real data
- The `Meeting` model is imported into `db.ts` solely to support this reset, creating an inappropriate coupling between the connection layer and the data layer

ALL-001 added `.env.example` documenting `MONGODB_URI`. The current code ignores a missing `MONGODB_URI` by silently falling back to the string `"fallback_default_mongodb_uri"`, which produces a confusing Mongoose connection error rather than a clear developer message.

## Goals / Non-Goals

**Goals:**
- Move all seeding logic out of `connectDB()` and into a dedicated `seed.ts` script
- Make seeding fully opt-in: requires `SEED_DB=true` environment variable
- Block seeding when `NODE_ENV=production`
- Support `--clear` flag to wipe existing data before reseeding
- Skip seeding if data already exists (idempotent default behavior)
- Replace the silent `|| "fallback_default_mongodb_uri"` fallback with a fail-fast `throw` in both `db.ts` and `seed.ts`
- Add `npm run seed` and `npm run seed:clear` scripts to `server/package.json`
- Update `server/README.md` to document the new seeding workflow

**Non-Goals:**
- Seeding any collection other than meetings
- Providing a rollback/undo seed mechanism
- Integrating seeding into CI pipelines (out of scope for this task)
- Changing the Meeting model or its schema

## Decisions

**Decision 1: Safety guard order — production check before SEED_DB check**

The `NODE_ENV=production` check runs first, before `SEED_DB`. This ensures production is always blocked regardless of what other env vars are set. An operator cannot accidentally enable seeding in production by setting `SEED_DB=true`.

Alternative considered: single combined condition. Rejected because the separate checks produce distinct, actionable error messages.

**Decision 2: Fail-fast throw at module load time for missing MONGODB_URI**

The `throw` is placed at the top level of both `db.ts` and `seed.ts`, outside any function, so it fires at module load time — not deferred until `connectDB()` or `seed()` is called. This surfaces the misconfiguration immediately when the process starts, not after an async delay.

Alternative considered: throw inside the async function. Rejected because it delays the error and makes it harder to distinguish from a network-level connection failure.

**Decision 3: Idempotent seed — skip if data exists**

If `Meeting.countDocuments()` returns > 0 and `--clear` is not passed, the script exits cleanly with a message. This prevents accidental duplicate seeding and makes `npm run seed` safe to run repeatedly.

**Decision 4: `tsc && node dist/seed.js` in npm scripts**

The seed scripts reuse the existing TypeScript compilation step rather than introducing a new runtime dependency (e.g., `ts-node`). This keeps the toolchain consistent with the existing `dev` script pattern.

## Risks / Trade-offs

- [Risk] Full `tsc` compile on every `npm run seed` call is slow for a large codebase → Mitigation: acceptable at this scale; can be optimized with `ts-node` later if needed
- [Risk] Developer forgets to set `SEED_DB=true` → Mitigation: the error message is explicit and actionable
- [Risk] `--clear` permanently deletes data → Mitigation: the flag must be explicitly passed and the script logs a clear warning before deleting

## Migration Plan

1. Apply code changes (create `seed.ts`, edit `db.ts`, `package.json`, `README.md`)
2. Run `npm run build` to confirm zero TypeScript errors
3. On first use in a fresh environment: `SEED_DB=true npm run seed`
4. Existing development environments with data can continue without seeding; `npm run seed` will skip if data exists

No rollback needed — this is an additive change. If `seed.ts` must be removed, delete the file and the two `package.json` script entries; `db.ts` changes are independently safe.

## Open Questions

None. All decisions are resolved based on the plan specification.
