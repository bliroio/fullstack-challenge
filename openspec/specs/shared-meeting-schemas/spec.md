## Purpose

Shared Zod schemas and TypeScript types for the Meeting domain, used by both server and client as the single canonical source of truth. Distributed as an npm workspace package.

## ADDED Requirements

### Requirement: Shared meeting schemas package exists at shared/schemas/meeting.ts
The project SHALL contain a file at `shared/schemas/meeting.ts` (sibling to `server/` and `client/`) that exports Zod schemas and inferred TypeScript types for the Meeting domain. This file SHALL be the single canonical source of truth for Meeting types across the stack.

#### Scenario: File exists with required exports
- **WHEN** `shared/schemas/meeting.ts` is imported
- **THEN** it SHALL export `meetingSchema`, `createMeetingSchema`, `listQuerySchema` as Zod schemas
- **THEN** it SHALL export `Meeting`, `CreateMeetingInput`, `ListQueryParams` as TypeScript types inferred from those schemas

### Requirement: meetingSchema validates API response shape
The `meetingSchema` SHALL define the shape of a meeting as returned by the API: `id` (string), `title` (string), `startTime` (coerced date), `endTime` (coerced date). It SHALL NOT use `.strict()` so that MongoDB documents with extra fields can still parse successfully.

#### Scenario: Valid meeting object parses successfully
- **WHEN** an object with `id`, `title`, `startTime`, and `endTime` is parsed by `meetingSchema`
- **THEN** the result SHALL be `{ success: true }` with dates coerced to Date objects

### Requirement: createMeetingSchema validates meeting creation input
The `createMeetingSchema` SHALL validate incoming meeting creation payloads with the following rules: `title` is required (min 1 char, max 200 chars), `startTime` and `endTime` are coerced dates, and `endTime` must be strictly after `startTime`. It SHALL use `.strict()` to reject unknown keys.

#### Scenario: Valid input is accepted
- **WHEN** an object with a non-empty title (max 200 chars) and endTime strictly after startTime is parsed
- **THEN** `createMeetingSchema.safeParse()` SHALL return `{ success: true }`

#### Scenario: endTime not after startTime is rejected
- **WHEN** an object with `endTime` equal to or before `startTime` is parsed
- **THEN** `createMeetingSchema.safeParse()` SHALL return `{ success: false }` with an error on the `endTime` path

#### Scenario: Unknown keys are rejected
- **WHEN** an object with a valid payload plus an extra unknown key is parsed
- **THEN** `createMeetingSchema.safeParse()` SHALL return `{ success: false }` with an "Unrecognized key(s)" error

#### Scenario: Missing title is rejected
- **WHEN** an object without `title` is parsed
- **THEN** `createMeetingSchema.safeParse()` SHALL return `{ success: false }`

### Requirement: listQuerySchema validates list/pagination query parameters
The `listQuerySchema` SHALL coerce and validate query parameters: `page` (positive integer, default 1), `limit` (positive integer, max 100, default 10), `sortBy` (enum of "startTime" | "endTime" | "title", default "startTime"), `sortOrder` (enum of "asc" | "desc", default "asc"), `title` (optional string, max 200). It SHALL use `.strict()` to reject unknown keys.

#### Scenario: Empty object parses with all defaults applied
- **WHEN** an empty object is parsed by `listQuerySchema`
- **THEN** result SHALL be `{ success: true, data: { page: 1, limit: 10, sortBy: "startTime", sortOrder: "asc" } }`

#### Scenario: page is always >= 1 after parse
- **WHEN** any valid `page` value is parsed
- **THEN** `result.data.page` SHALL be greater than or equal to 1

#### Scenario: limit is capped at 100
- **WHEN** a `limit` greater than 100 is parsed
- **THEN** `listQuerySchema.safeParse()` SHALL return `{ success: false }`

### Requirement: Shared package is an npm workspace with its own build
The `shared` directory SHALL be an npm workspace package with its own `package.json` (declaring `name: "shared"`, `main: "dist/index.js"`, `types: "dist/index.d.ts"`) and `tsconfig.json` that emits compiled JavaScript and declaration files to `shared/dist/`. A root `package.json` SHALL declare `"workspaces": ["client", "server", "shared"]`.

#### Scenario: Shared package builds independently
- **WHEN** `npm run build -w shared` is run from the project root
- **THEN** compiled JS and `.d.ts` files SHALL appear in `shared/dist/`

### Requirement: Server imports shared schemas as a workspace dependency
The `server/package.json` SHALL declare `"shared": "*"` as a dependency. The server's `tsconfig.json` SHALL NOT include `"../shared/**/*"` in its `include` array. Server code SHALL import from `"shared"` (not relative paths).

#### Scenario: Server build succeeds with flat output
- **WHEN** `npm run build` is run in the `server/` directory (after building shared)
- **THEN** the TypeScript compiler SHALL exit with zero errors
- **THEN** the entry point SHALL be at `dist/server.js` (not `dist/server/src/server.js`)

### Requirement: Client imports shared schemas as a workspace dependency
The `client/package.json` SHALL declare `"shared": "*"` as a dependency. The client's `tsconfig.json` SHALL NOT require `@shared/*` path aliases or `"../shared/**/*.ts"` includes. Client code SHALL import from `"shared"` (not `@shared/*`).

#### Scenario: Client build succeeds with workspace resolution
- **WHEN** `npm run build` is run in the `client/` directory (after building shared)
- **THEN** the Next.js compiler SHALL exit with zero errors when any client file imports from `"shared"`

### Requirement: Schema tests pass with fast-check property-based testing
A test file at `shared/schemas/__tests__/meeting.test.ts` SHALL verify schema correctness using fast-check property-based tests. Tests SHALL run via vitest.

#### Scenario: Property-based tests pass for createMeetingSchema valid inputs
- **WHEN** vitest runs the meeting schema test suite
- **THEN** all tests SHALL pass with zero failures
