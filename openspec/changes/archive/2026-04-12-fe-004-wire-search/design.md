## Context

The application has a styled search TextField in the header that is visually present but non-functional. The Express backend already accepts a `?title=` query parameter in `GET /api/meetings` and performs a case-insensitive regex search. The frontend service (`listMeetings`) always calls the endpoint without query params, so the feature is unreachable from the UI.

Current data flow: `page.tsx` calls `listMeetings()` once on mount → `meetingService.ts` always fetches `?limit=100` → results rendered in `MeetingList`.

Target data flow: user types in Header → debounced `onSearch` fires → `page.tsx` state update → `listMeetings({ title })` → filtered results rendered.

## Goals / Non-Goals

**Goals:**
- Connect the search field to `listMeetings` so results filter in real-time
- Debounce input to 300ms to avoid excessive API calls
- Preserve existing Zod response validation in `meetingService.ts`
- Add unit tests covering debounce behavior

**Non-Goals:**
- URL/querystring persistence of search state (deferred)
- Backend changes (already supported)
- Loading/error state UI during search (deferred)
- Moving API base URL to environment variable (FE-008 scope)

## Decisions

### 1. Debounce via `useRef` + `setTimeout` in `Header` (not a custom hook or library)

**Decision**: Implement debounce manually with `useRef<ReturnType<typeof setTimeout>>` and `clearTimeout` inside the `handleSearchChange` handler.

**Rationale**: No additional dependencies. The pattern is simple enough that a custom hook or utility adds more indirection than value for a single use case. Using `useRef` avoids stale closure issues since the ref is mutated in place.

**Alternative considered**: `useDebouncedCallback` from `use-debounce` library — rejected to keep the dependency tree minimal.

### 2. Search state lives in `page.tsx`, not `Header`

**Decision**: `Header` is a controlled-callback component — it calls `onSearch(value)` but holds no search state itself. The search query string lives as `searchQuery` state in `page.tsx`.

**Rationale**: `page.tsx` is the orchestrator that owns both the meeting list and the fetch logic. Lifting state here avoids prop-drilling or context for a simple parent-child relationship, and keeps `Header` reusable and testable in isolation.

### 3. Re-fetch triggered via `useCallback` + `useEffect` dependency

**Decision**: `fetchMeetings` is a `useCallback` that closes over `searchQuery`. The `useEffect` depends on `fetchMeetings`, so it re-runs whenever `searchQuery` changes.

**Rationale**: This is the idiomatic React pattern for derived async effects. It ensures both the initial load and search-triggered refetches use the same code path. The `useCallback` memoizes the function reference so the effect only fires when `searchQuery` actually changes.

### 4. Preserve Zod validation in `meetingService.ts`

**Decision**: Keep `parseMeeting`/`parseMeetings` Zod validation when updating `listMeetings` signature.

**Rationale**: The current service already validates responses. The plan template omitted this, but dropping validation would be a regression. The `params` argument is additive and does not require removing existing safety checks.

## Risks / Trade-offs

- [Risk] Debounce timer not cleared on component unmount → `onSearch` called after unmount.
  **Mitigation**: `useRef` stores the timer. Since `Header` is a persistent top-level component and never unmounts during normal app use, this is acceptable. A cleanup `useEffect` returning `() => clearTimeout(debounceTimerRef.current)` could be added if unmounting becomes a concern.

- [Risk] Empty-string search returns all meetings, which is correct behavior but may be surprising if empty-string is treated differently from "no search".
  **Mitigation**: `page.tsx` uses `searchQuery ? { title: searchQuery } : undefined` — empty string maps to "no filter", matching user expectation.

- [Trade-off] Header `onSearch` prop is now required, making it a breaking change for any other callers.
  **Note**: There is exactly one call site (`page.tsx`), which is updated in the same change.
