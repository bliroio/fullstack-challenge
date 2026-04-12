## Context

The Express server currently lives entirely in `server/src/app.ts`, which creates the Express app, calls `connectDB()`, and calls `app.listen()` in one module. This coupling prevents Supertest-based tests from importing the app: any `import app from "./app"` in a test file would attempt a real MongoDB connection and bind a port on the test machine.

There is no test runner configured. The `server/` package has no `vitest` (or any test framework) dependency and no `test` script. Downstream tasks (BE-002, ALL-006, BE-004/005/006/008) all assume a working test harness exists.

## Goals / Non-Goals

**Goals:**
- Decouple the Express app module from runtime side-effects (DB connect, port listen) so tests can import `app` safely
- Establish Vitest as the test runner with Supertest for HTTP integration tests and fast-check for property-based tests
- Pass `npm run build` and `npm test` with zero errors after the split
- Preserve existing runtime behavior (server still connects to DB and listens on startup)

**Non-Goals:**
- Writing actual test cases (those belong to BE-002, ALL-006, BE-004/005/006/008)
- Setting up an in-memory MongoDB for integration tests (deferred to integration test tasks)
- Changing any existing API routes or middleware behavior

## Decisions

**Decision 1: Two-file split (app.ts / server.ts)**
- `app.ts` becomes a pure Express app factory — creates and exports the app, registers middleware and routes, no side-effects.
- `server.ts` is the new runtime entry point — imports `app`, calls `connectDB()`, then `app.listen()`.
- Alternative considered: keep single file and stub out `connectDB`/`listen` in tests via mocking. Rejected because mocking module internals is fragile and makes tests harder to read than the clean split pattern.

**Decision 2: Vitest over Jest**
- Vitest shares Vite config, has first-class TypeScript support with zero extra config, and is significantly faster. The project already uses TypeScript throughout.
- Alternative: Jest with ts-jest. Rejected because of heavyweight config and slower compilation.

**Decision 3: `vitest run --passWithNoTests` for initial `npm test`**
- At the point this task is applied, no test files exist yet. `--passWithNoTests` ensures `npm test` exits 0 immediately, unblocking CI and subsequent tasks without requiring a placeholder test file.
- This flag is removed or becomes irrelevant once real tests are added.

**Decision 4: `globals: true` in vitest config**
- Allows test files to use `describe`, `it`, `expect` etc. without explicit imports — matching the ergonomics expected by downstream test task authors.

## Risks / Trade-offs

- [Risk] `dotenv.config()` is called in both `app.ts` (currently) and will be called in `server.ts`. If left in `app.ts`, tests that import `app` will attempt to read `.env`.
  → Mitigation: move `dotenv.config()` to `server.ts` only; remove it from `app.ts`. Tests set env vars directly or use `.env.test` if needed.

- [Risk] Any existing process that imports `app.ts` directly and relies on the listener being started will break.
  → Mitigation: the only runtime caller is the npm `start`/`dev` script, which will point to `server.js` after this change. No other callers exist.

- [Risk] TypeScript compilation target must include `server.ts` as an entry point.
  → Mitigation: `tsconfig.json` uses `"include": ["src"]` which already covers `src/server.ts` — no tsconfig changes needed.
