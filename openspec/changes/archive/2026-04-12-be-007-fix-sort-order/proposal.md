## Why

The meeting list is currently sorted reverse-chronologically (`startTime: -1`), so past meetings appear at the top. Users need to see upcoming meetings first so the most actionable item is immediately visible when they load the page.

## What Changes

- The `listMeetings` service in `server/src/services/meetingService.ts` sorts meetings by `startTime` ascending (`1`) instead of descending (`-1`).

## Capabilities

### New Capabilities

<!-- None — this is a one-line implementation fix, no new capability is introduced. -->

### Modified Capabilities

<!-- No spec-level requirement changes. The existing meeting list and search specs do not prescribe a sort order, so no delta spec is needed. -->

## Impact

- `server/src/services/meetingService.ts`: sort option changes from `{ startTime: -1 }` to `{ startTime: 1 }`.
- The REST API response for `GET /api/meetings` will return meetings in ascending `startTime` order.
- No schema, interface, or API contract changes.
