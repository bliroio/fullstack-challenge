## Why

The meetings list page currently shows nothing while data is loading, silently fails when the API is unavailable, and displays a blank area when no meetings exist. These silent failures degrade user experience and make the app appear broken.

## What Changes

- Add `loading` boolean state to `Home` (page.tsx), initialized to `true` so the first fetch shows a spinner
- Add `error` string-or-null state to `Home`, set when `listMeetings` rejects
- Make `fetchMeetings` async with try/catch/finally to manage loading and error state
- Pass `loading` and `error` as props to `MeetingList`
- `MeetingList` gains three conditional render branches: spinner (loading), error alert, empty-state message
- Add `client/app/__tests__/page.test.tsx` with four integration tests covering all four states

## Capabilities

### New Capabilities

- `meetings-list-states`: Loading spinner, error alert, and empty-state messaging for the meetings list page

### Modified Capabilities

- `client-layout`: `Home` passes additional props (`loading`, `error`) to `MeetingList`; `MeetingList` accepts and renders three new conditional states

## Impact

- `client/app/page.tsx`: async fetchMeetings, two new state variables, new props on MeetingList
- `client/app/components/meetingList.tsx`: expanded Props type, three new render branches, additional MUI imports (Alert, Box, CircularProgress)
- `client/app/__tests__/page.test.tsx`: new test file using existing MSW/TestProviders infrastructure
- No API changes, no schema changes, no new dependencies
