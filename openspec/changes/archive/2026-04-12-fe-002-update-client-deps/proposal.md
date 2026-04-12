## Why

The client currently maintains its own `Meeting` type in `client/app/models/Meeting.ts`, duplicating a definition that now exists authoritatively in `shared/schemas/meeting.ts` (introduced by ALL-006). The client also lacks `zod`, `react-hook-form`, and `@hookform/resolvers`, which are needed for validated form handling in upcoming tasks.

## What Changes

- Install `zod`, `react-hook-form`, and `@hookform/resolvers` in `client/package.json`
- **Delete** `client/app/models/Meeting.ts` (and the now-empty `client/app/models/` directory)
- Add `exports` field to `shared/package.json` for subpath resolution (e.g., `shared/schemas/meeting`)
- Remove the `@shared/*` tsconfig paths hack from `client/tsconfig.json`
- Update 7 client files to replace `import { Meeting } from "...models/Meeting"` with `import type { Meeting } from "shared/schemas/meeting"`
- Remove the redundant type cast in `meetingService.ts` now that `Meeting` is `z.infer<typeof meetingSchema>`

## Capabilities

### New Capabilities
- `client-form-deps`: Adds `react-hook-form` and `@hookform/resolvers` to the client, enabling schema-validated forms.

### Modified Capabilities
- `shared-meeting-schemas`: The client now consumes `shared/schemas/meeting` (via workspace subpath exports) as its canonical `Meeting` type source; the old local duplicate is removed.

## Impact

- `client/package.json`: three new runtime dependencies added
- `shared/package.json`: `exports` field added for subpath resolution
- `client/tsconfig.json`: `@shared/*` paths entry removed
- `client/app/models/Meeting.ts`: deleted
- 7 TypeScript files updated (import path change only, no logic change)
- TypeScript compilation must remain clean (`tsc --noEmit` zero errors)
