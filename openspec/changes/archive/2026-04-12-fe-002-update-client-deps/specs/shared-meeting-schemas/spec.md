## MODIFIED Requirements

### Requirement: Client imports shared schemas via workspace subpath exports
The `shared/package.json` SHALL declare an `exports` field mapping `"."` and `"./schemas/*"` to their compiled `dist/` outputs. The `client/package.json` SHALL declare `"shared": "*"` as a dependency. Client code SHALL import `Meeting` (and other shared types) using `import type { Meeting } from "shared/schemas/meeting"`. The client's `tsconfig.json` SHALL NOT contain a `@shared/*` paths entry. The local `client/app/models/Meeting.ts` file SHALL NOT exist.

#### Scenario: Client build succeeds with workspace resolution
- **WHEN** `npm run build` is run in the `client/` directory (after building shared)
- **THEN** the Next.js compiler SHALL exit with zero errors when any client file imports from `"shared/schemas/meeting"`

#### Scenario: No old model file remains
- **WHEN** the filesystem is inspected
- **THEN** `client/app/models/Meeting.ts` SHALL NOT exist

#### Scenario: No old import paths remain in client source
- **WHEN** `grep -r "models/Meeting" client/app/` is run
- **THEN** the command SHALL return zero results

#### Scenario: No tsconfig paths hack remains
- **WHEN** `client/tsconfig.json` is inspected
- **THEN** there SHALL be no `@shared/*` entry in `compilerOptions.paths`
