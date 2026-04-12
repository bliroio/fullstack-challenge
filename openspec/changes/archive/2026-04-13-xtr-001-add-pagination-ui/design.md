## Context

The meetings API (`GET /api/meetings`) already supports `page` and `limit` query params via mongoose-paginate-v2 and returns a `PaginatedResponse` shape. The client currently ignores pagination by hardcoding `?limit=100` and extracting only `docs`. This change wires up the existing server capability to a UI pagination control.

Current call flow:
```
page.tsx (fetchMeetings) → listMeetings() → GET /api/meetings?limit=100 → { docs: [...], totalPages, ... }
                                  ↓
                             returns Meeting[]
```

Target call flow:
```
page.tsx (fetchMeetings(pageNum)) → listMeetings({ page, limit }) → GET /api/meetings?page=N&limit=10 → PaginatedResponse
                                          ↓
                                     returns PaginatedResponse (page.tsx unpacks docs + totalPages)
```

## Goals / Non-Goals

**Goals:**
- Remove the hardcoded `?limit=100` from `listMeetings`
- `listMeetings` returns the full `PaginatedResponse` so callers can access `totalPages` and `page`
- `page.tsx` holds `page` and `totalPages` state
- MUI `Pagination` component renders below the list, hidden when `totalPages <= 1`
- Page resets to 1 after create; stays on current page after delete
- Search continues to work (search re-fetches from page 1)

**Non-Goals:**
- Server-side changes (pagination already implemented)
- Configurable page size in the UI
- URL-based pagination (no router query params)
- Infinite scroll

## Decisions

**Decision 1: Return full PaginatedResponse from `listMeetings`, not just `docs`**

Alternatives considered:
- Return `{ docs, totalPages, page }` partial shape — couples the service to the caller's needs; the full type already exists
- Keep returning `Meeting[]` and accept a callback for pagination metadata — awkward API surface

Chosen: return the complete `PaginatedResponse` type, export it so `page.tsx` can annotate state types. The service is the natural boundary for the raw API shape.

**Decision 2: Export `PaginatedResponse` from `meetingService.ts`**

`page.tsx` needs to destructure `totalPages` from the response. Exporting the type avoids duplication. Alternative (re-declare in `page.tsx`) creates drift.

**Decision 3: Keep `fetchMeetings` as the single fetch entrypoint in `page.tsx`**

The existing `fetchMeetings` already wraps loading/error state. Extend it to accept a `pageNum` argument rather than creating separate functions. This avoids duplication across create, delete, search, and useEffect call sites.

**Decision 4: Hide Pagination when `totalPages <= 1`**

Avoids showing a useless single-page paginator for small datasets. Implemented with `{totalPages > 1 && <Pagination ... />}`.

**Decision 5: No new npm dependency**

MUI `Pagination` is part of `@mui/material`, which is already installed.

## Risks / Trade-offs

- [Risk: fetchMeetings closes over stale `searchQuery`] → The `fetchMeetings` `useCallback` already lists `searchQuery` as a dependency; the new `pageNum` param is explicit, so search + page interact correctly.
- [Risk: delete on last item of a page leaves empty page] → Acceptable for now; after delete the current page is re-fetched and the server returns whatever is there (possibly empty). A future improvement could decrement page if `docs` is empty.
- [Risk: page resets on every search change] → Expected behavior; search always starts at page 1.
