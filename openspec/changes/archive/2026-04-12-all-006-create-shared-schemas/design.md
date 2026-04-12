## Context

The codebase currently defines the Meeting concept in 5+ places with no shared source of truth, causing type drift. The fix is to establish `shared/schemas/meeting.ts` as the single canonical definition using Zod, which provides runtime validation, TypeScript type inference, and composable schema building. Both the Express server (CommonJS) and the Next.js client (ESM/bundler) need access to these types with different import resolution strategies.

**Update (2026-04-12):** The original approach used relative imports on the server and `@shared/*` path alias on the client, with `../shared/**/*` in both tsconfig `include` arrays. This caused the server's `tsc` to compute a rootDir spanning the repo root, nesting output at `dist/server/src/server.js` instead of `dist/server.js`. The revised approach uses **npm workspaces** to make `shared` a proper local package, giving both server and client clean `import from "shared"` semantics with no path hacks.

## Goals / Non-Goals

**Goals:**
- Single canonical Zod schema for Meeting types accessible by both server and client
- TypeScript type-checking for shared code in both `server/` and `client/` build pipelines
- Property-based tests (fast-check) verifying schema correctness in isolation
- Clean `dist/server.js` output path on the server (no nested `dist/server/src/` structure)
- Both server and client import from `"shared"` as a workspace dependency

**Non-Goals:**
- Auto-generating Mongoose schema from Zod (lossy — Mongoose needs plugins, virtuals, indexes)
- Publishing the shared package to npm (it is a local workspace package only)
- Changing any existing route or controller code (those are later tasks)

## Decisions

### Decision 1 (revised): npm workspaces — `shared` as a local package

**Problem**: The original approach included `"../shared/**/*"` in the server's tsconfig `include`, which forced TypeScript to compute `rootDir` as the repo root. This caused the compiled output to nest at `dist/server/src/server.js` instead of `dist/server.js`, breaking all npm scripts that referenced `dist/server.js`.

**Options considered**:
- Fix the script paths to `dist/server/src/server.js` — works but ugly, fragile
- Use `tsx` for dev — avoids the problem but only for dev, not production builds
- npm workspaces — `shared` becomes a proper package with its own build; server and client add `"shared": "*"` as a dependency; npm symlinks it locally

**Decision**: Use npm workspaces. A root `package.json` declares `"workspaces": ["client", "server", "shared"]`. The `shared` package has its own `tsconfig.json` that emits JS + declarations to `shared/dist/`. Server and client import from `"shared"` — npm resolves the symlink to `../../shared`, and both TypeScript and Node find the built output via the package's `main` and `types` fields.

**Trade-off**: Shared must be built before server/client. This is a one-command step (`npm run build -w shared`) and can be wired as a `prebuild` script.

### Decision 2: `.strict()` on input schemas, not on response schema

`createMeetingSchema` and `listQuerySchema` use `.strict()` to reject payloads with unknown keys, making injection attempts (e.g., `$where`) visible as validation errors rather than being silently stripped. `meetingSchema` (response shape) does NOT use `.strict()` because data from MongoDB may include Mongoose internals or fields added by future migrations.

### Decision 3: `z.coerce.date()` for date fields in input schemas

API inputs arrive as ISO strings. `z.coerce.date()` transparently converts strings, numbers, and Date objects to Date, which is the correct type for business logic comparisons. The `.refine()` on `createMeetingSchema` then compares two Date objects directly.

### Decision 4 (revised): Zod installed in shared, hoisted via workspaces

With npm workspaces, `zod` is declared as a dependency of the `shared` package. npm hoists it to the root `node_modules/`. Server and client also have `zod` in their own dependencies (for their own direct usage), and npm deduplicates to a single copy.

## Risks / Trade-offs

- **Schema drift (Zod vs Mongoose)**: Adding a new field still requires updating both `shared/schemas/meeting.ts` and `server/src/models/meeting.ts` manually. Mitigation: document this in both files; later tasks will add integration tests that catch drift.
- **Build order dependency**: `shared` must be built before `server` and `client`. Mitigation: CI builds in order (`shared` → `server` / `client`); locally, `prebuild` scripts or a single `npm run build -w shared` command.
- **Workspace symlinks**: Some tools (Docker COPY, deployment scripts) may need awareness of the workspace structure. Mitigation: standard npm workspaces pattern, well-documented.
