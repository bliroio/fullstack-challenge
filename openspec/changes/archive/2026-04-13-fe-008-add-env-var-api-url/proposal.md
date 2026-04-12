## Why

The client meeting service hardcodes `http://localhost:3000/api/meetings` as its base URL, making it impossible to deploy the frontend against any other backend without modifying source code. Externalising this to a `NEXT_PUBLIC_API_URL` environment variable allows the same build to target any environment.

## What Changes

- Replace the hardcoded `const API_BASE_URL = "http://localhost:3000/api/meetings"` constant with `const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"` in `client/app/services/meetingService.ts`
- Update every call site that constructs a URL from `API_BASE_URL` to append `/meetings` (or `/meetings/<id>`) so that the base URL no longer includes the resource path
- No `.env` file is added — the fallback default preserves local-dev behaviour

## Capabilities

### New Capabilities

- `api-base-url-config`: Configurable API base URL for the client meeting service via `NEXT_PUBLIC_API_URL` environment variable

### Modified Capabilities

<!-- No existing spec-level requirements are changing — this is an internal implementation detail of the client service layer -->

## Impact

- `client/app/services/meetingService.ts` — only file changed
- Consumers of `listMeetings`, `createMeeting`, `deleteMeeting`, and `updateMeeting` are unaffected (same function signatures and return types)
- No new runtime dependencies
- `npx tsc --noEmit` in `client/` must continue to pass
