## Why

The Express app currently couples DB connection and HTTP listener startup inside `app.ts`, making it impossible to import the app in tests without triggering a real MongoDB connection and binding a port. Supertest requires a bare Express app with no active listener; the codebase has no test runner at all, blocking all subsequent test tasks (BE-002, ALL-006, BE-004/005/006/008).

## What Changes

- Install `vitest`, `supertest`, `@types/supertest`, and `fast-check` as dev dependencies in `server/`
- Split `server/src/app.ts`: remove `connectDB()` call, `app.listen()` block, and port declaration; add `export default app`
- Create `server/src/server.ts` as the new runtime entry point: imports `app`, calls `connectDB()`, then `app.listen()`
- Update `server/package.json` scripts: `start` and `dev` point to `dist/server.js`; add `test` and `test:watch` scripts
- Create `server/vitest.config.ts` with node environment, globals enabled, and `src/**/*.test.ts` include pattern

## Capabilities

### New Capabilities

- `server-test-infrastructure`: Vitest + Supertest test infrastructure for the Express server, including app/server entry-point split and vitest configuration

### Modified Capabilities

- (none — no existing spec-level requirements are changing)

## Impact

- `server/src/app.ts` — modified (removes listener/DB coupling, adds default export)
- `server/src/server.ts` — new file (runtime entry point)
- `server/package.json` — modified (scripts + devDependencies)
- `server/vitest.config.ts` — new file
- `server/node_modules` — vitest, supertest, @types/supertest, fast-check installed
- No client-side changes; no API surface changes
