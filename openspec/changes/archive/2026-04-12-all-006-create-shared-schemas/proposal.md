## Why

The Meeting concept is currently defined in 5+ places across the stack (Mongoose model, client interface, Swagger comments, route JSDoc, etc.) with no shared source of truth — causing type drift, missing fields, and broken API contracts. A single shared Zod schema package eliminates duplication by giving both server and client a unified definition for types, validation rules, and API shape.

Additionally, the original approach of including `../shared/**/*` in each project's tsconfig caused the server's TypeScript compiler to compute a rootDir spanning the repo root, nesting output at `dist/server/src/server.js` instead of `dist/server.js` — breaking npm scripts. The revised approach uses npm workspaces to make `shared` a proper local package.

## What Changes

- **New**: `shared/schemas/meeting.ts` — Zod schemas (`meetingSchema`, `createMeetingSchema`, `listQuerySchema`) and derived TypeScript types (`Meeting`, `CreateMeetingInput`, `ListQueryParams`)
- **New**: `shared/schemas/__tests__/meeting.test.ts` — property-based tests with fast-check validating schema correctness
- **New**: `shared/package.json` — local workspace package with `main`, `types`, and build script
- **New**: `shared/tsconfig.json` — emits JS + declarations to `shared/dist/`
- **New**: `shared/src/index.ts` — barrel export re-exporting all schemas
- **New**: Root `package.json` — declares npm workspaces (`client`, `server`, `shared`)
- **Edit**: `server/tsconfig.json` — remove `"../shared/**/*"` from `include`, remove `paths.zod` workaround
- **Edit**: `server/package.json` — add `"shared": "*"` dependency, restore `dist/server.js` script paths
- **Edit**: `client/tsconfig.json` — replace `@shared/*` path alias with standard module resolution, remove `paths.zod` workaround, remove `../shared/**/*.ts` from `include`
- **Edit**: `client/package.json` — add `"shared": "*"` dependency
- **Install**: `zod` as a dependency of `shared/` package

## Capabilities

### New Capabilities

- `shared-meeting-schemas`: Shared Zod validation schemas and TypeScript types for meetings, importable by both server and client as `import { ... } from "shared"` via npm workspaces

### Modified Capabilities

- `meeting-schema-validation`: The Zod `createMeetingSchema` introduces an API-layer validation (endTime > startTime) that mirrors and complements the existing Mongoose-level validator defined in this spec. The Zod schema is now the primary type source; Mongoose remains for DB-level defense-in-depth.

## Impact

- **New directory**: `shared/` at project root with its own `package.json` and `tsconfig.json`
- **New file**: Root `package.json` declaring npm workspaces
- **Server**: Imports from `"shared"` as a workspace dependency (clean module resolution, no relative path hacks)
- **Client**: Imports from `"shared"` as a workspace dependency (no `@shared/*` alias needed)
- **Build order**: `shared` must be built before `server` and `client` (CI: `npm run build -w shared` first)
- **Dependencies**: `zod` declared in `shared/package.json`; `fast-check` in shared devDependencies for tests
