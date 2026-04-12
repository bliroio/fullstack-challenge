## Why

The meetings list currently fetches all records with `?limit=100`, which bypasses the server's built-in pagination and will degrade as data grows. Users have no way to navigate large lists, and the client always over-fetches. The server already supports `page` and `limit` query params via mongoose-paginate-v2, so adding a pagination UI is a low-effort, high-value improvement.

## What Changes

- `listMeetings` in `meetingService.ts` is updated to accept `page` and `limit` params and return the full `PaginatedResponse` object (instead of just `docs`), removing the hardcoded `?limit=100`
- `page.tsx` gains `page` and `totalPages` state, a `fetchMeetings` helper that passes the current page to the service, and an MUI `Pagination` component rendered below the meeting list
- The `Pagination` component is hidden when `totalPages <= 1` (10 or fewer meetings)
- Create and delete actions navigate to page 1 after completion
- Delete on any page re-fetches the current page

## Capabilities

### New Capabilities

- `meeting-pagination`: Client-side paginated fetching and rendering of the meetings list using the MUI Pagination component

### Modified Capabilities

- `meetings-list-states`: The fetch function now takes a page argument; loading and error states remain but are tied to the paginated fetch helper

## Impact

- `client/app/services/meetingService.ts`: `listMeetings` signature and return type change (callers in `page.tsx` only)
- `client/app/page.tsx`: fetchMeetings refactored, pagination state added, Pagination component added to JSX
- No server changes required
- No new npm dependencies required (MUI Pagination is already part of `@mui/material`)
