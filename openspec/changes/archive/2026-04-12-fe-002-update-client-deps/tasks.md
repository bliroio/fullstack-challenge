## 1. Install Client Dependencies

- [x] 1.1 Run `npm install zod react-hook-form @hookform/resolvers` in the `client/` directory
- [x] 1.2 Verify `zod`, `react-hook-form`, and `@hookform/resolvers` appear in `client/package.json` dependencies

## 2. Delete Old Models File

- [x] 2.1 Delete `client/app/models/Meeting.ts`
- [x] 2.2 Remove the now-empty `client/app/models/` directory

## 3. Configure Workspace Subpath Exports

- [x] 3.1 Add `exports` field to `shared/package.json` mapping `.` and `./schemas/*` to their `dist/` outputs
- [x] 3.2 Remove the `@shared/*` paths entry from `client/tsconfig.json`

## 4. Update Imports in Client Source Files

- [x] 4.1 In `client/app/services/meetingService.ts`: replace `import type { Meeting } from "@shared/schemas/meeting"` with `import type { Meeting } from "shared/schemas/meeting"`; also update `meetingSchema` import
- [x] 4.2 In `client/app/services/meetingService.ts`: ensure the `parseMeeting` helper has no redundant type cast
- [x] 4.3 In `client/app/page.tsx`: replace `import type { Meeting } from "@shared/schemas/meeting"` with `import type { Meeting } from "shared/schemas/meeting"`
- [x] 4.4 In `client/app/components/header.tsx`: replace `import type { Meeting } from "@shared/schemas/meeting"` with `import type { Meeting } from "shared/schemas/meeting"`
- [x] 4.5 In `client/app/components/meetingList.tsx`: replace `import type { Meeting } from "@shared/schemas/meeting"` with `import type { Meeting } from "shared/schemas/meeting"`
- [x] 4.6 In `client/app/components/create-meeting/components/CreateMeetingDrawer.tsx`: replace `import type { Meeting } from "@shared/schemas/meeting"` with `import type { Meeting } from "shared/schemas/meeting"`
- [x] 4.7 In `client/app/components/create-meeting/components/CreateMeetingForm.tsx`: replace `import type { Meeting } from "@shared/schemas/meeting"` with `import type { Meeting } from "shared/schemas/meeting"`
- [x] 4.8 In `client/app/components/create-meeting/hooks/useCreateMeetingForm.ts`: replace `import type { Meeting } from "@shared/schemas/meeting"` with `import type { Meeting } from "shared/schemas/meeting"`

## 5. Verify

- [x] 5.1 Confirm `client/app/models/Meeting.ts` no longer exists
- [x] 5.2 Run `grep -r "models/Meeting" client/app/` and confirm zero results
- [x] 5.3 Run `grep -r "@shared/" client/` and confirm zero results (no remaining tsconfig paths references)
- [x] 5.4 Run `cd client && npx tsc --noEmit` and confirm zero TypeScript errors
