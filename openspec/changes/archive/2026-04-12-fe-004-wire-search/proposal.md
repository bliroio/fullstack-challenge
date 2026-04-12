## Why

The search bar in the header is purely decorative — typing in it does nothing. The backend already supports `?title=` query parameter for case-insensitive regex filtering, but the frontend never passes it. Users have no way to find meetings by name.

## What Changes

- `meetingService.ts`: `listMeetings` accepts an optional `params?: { title?: string }` argument and appends `&title=<encoded>` to the URL when provided
- `header.tsx`: Accepts a new `onSearch: (query: string) => void` prop; search TextField fires debounced `onSearch` after 300ms of inactivity
- `page.tsx`: Adds `searchQuery` state and `onSearch` callback; re-fetches meetings via `listMeetings` whenever `searchQuery` changes
- New test file `client/app/components/__tests__/header.test.tsx` verifying debounce behavior

## Capabilities

### New Capabilities

- `meeting-title-search`: End-to-end search flow wiring header search input to filtered meeting list via debounced API call with `?title=` query parameter

### Modified Capabilities

- `client-layout`: Header component gains a required `onSearch` prop, changing its public API

## Impact

- **Files changed**: `client/app/services/meetingService.ts`, `client/app/page.tsx`, `client/app/components/header.tsx`
- **New file**: `client/app/components/__tests__/header.test.tsx`
- **API**: No backend changes; the existing `GET /api/meetings?title=` endpoint is consumed
- **Dependencies**: No new npm packages required; uses `useRef`/`useCallback` (React built-ins) and `setTimeout`/`clearTimeout` (browser built-ins)
- **Breaking change**: `Header` component now requires `onSearch` prop — all usages in `page.tsx` must be updated (only one call site)
