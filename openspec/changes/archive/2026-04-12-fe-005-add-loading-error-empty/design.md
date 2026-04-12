## Context

The `Home` page fetches meetings via `listMeetings()` in a `useCallback`/`useEffect` pair. Currently there is no loading indicator, no error handling, and no empty-state message — the list simply stays empty while fetching, fails silently on network errors, and shows nothing when the server returns zero results.

The existing test infrastructure (MSW, TestProviders, vitest config) is already in place from ALL-004. The component tree is shallow: `Home` → `MeetingList`.

## Goals / Non-Goals

**Goals:**
- Show an orange `CircularProgress` spinner while the API call is in flight
- Show a MUI `Alert` (severity="error") when the API call rejects
- Show "No meetings found" centered text when the API returns an empty docs array
- Add four vitest integration tests (loading, error, empty, data) that pass green after implementation

**Non-Goals:**
- Retry logic or exponential back-off
- Pagination controls
- Toast notifications or snackbars
- Any backend changes

## Decisions

**Decision: loading starts as `true`**
Initializing `loading` to `true` (instead of `false`) means the spinner appears immediately on mount before the first `useEffect` fires. This prevents a flash of empty state on initial load.
Alternative: initialize to `false` and set to `true` inside `useEffect` — introduces a one-render flash of empty state.

**Decision: async/await with try/catch/finally in `fetchMeetings`**
Converting `fetchMeetings` from a `.then()` chain to `async/await` makes error handling straightforward with try/catch/finally.
Alternative: `.then().catch().finally()` chain — equivalent but less readable and harder to add intermediate awaits later.

**Decision: early-return pattern in `MeetingList`**
Three conditional early-returns (loading → spinner, error → alert, empty → empty state) before the main render keep each state isolated and easy to test.
Alternative: conditional JSX inline in a single return — nests logic and reduces clarity.

**Decision: reuse existing MSW/TestProviders infrastructure**
The test file imports from existing `./mocks/server` and `./helpers/TestProviders`. No new test dependencies needed.

## Risks / Trade-offs

- **`loading` stays `true` if `fetchMeetings` is never called** → Not a real risk: `useEffect` fires on mount and calls it immediately.
- **`Meeting.startTime` / `endTime` typed as `Date` but runtime value is ISO string** → `formatDate` already accepts `Date | string`; `new Date(string)` handles it correctly. No change needed.
- **Spinner blocks any render of `MeetingList` content during re-fetches (e.g., search)** → Intentional; prevents stale content flashing. Acceptable trade-off for simplicity.
