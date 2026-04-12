## Context

The server follows an established pattern from BE-004 (POST endpoint): controller → service → Mongoose model, with `asyncHandler` wrapping controllers and `AppError` for domain errors. The global error handler converts `AppError` instances to HTTP responses. The client service layer uses axios; `page.tsx` owns list state and passes callbacks down.

The `meetingList.tsx` component currently receives `meetings`, `loading`, and `error` props. It renders loading/error/empty states internally. Adding a delete button requires threading an `onDelete` callback prop through to the component without disrupting the existing prop contract.

## Goals / Non-Goals

**Goals:**
- Add `DELETE /api/meetings/:id` that returns 204, 404, or 400
- Validate ID format before hitting Mongoose to avoid `CastError` leaking to callers
- Render a trash icon delete button on each meeting card
- Refresh the meeting list after a successful delete
- Write TDD integration tests that cover success, 404, and 400 paths

**Non-Goals:**
- Optimistic UI updates (list refresh is a full refetch, not local state mutation)
- Undo / soft-delete / confirmation dialog
- Pagination state preservation after delete
- Auth/authorization for delete

## Decisions

### 1. ID validation in service, not controller

**Decision:** `deleteMeeting` service validates the ID with `mongoose.Types.ObjectId.isValid(id)` and throws `AppError(400, ...)` before calling Mongoose.

**Rationale:** Catching `CastError` in the controller couples the controller to Mongoose internals. Validating in the service keeps the controller thin and consistent with the existing `asyncHandler` pattern — controllers never contain try/catch.

**Alternative:** Validate in middleware — rejected because this is business logic tied to the meeting domain, not a generic input validation concern.

### 2. `onDelete` prop is optional on `MeetingList`

**Decision:** `onDelete?: (id: string) => void` is optional. The delete button only renders when `onDelete` is provided.

**Rationale:** Avoids a required-prop breaking change. Existing call sites that don't pass `onDelete` (e.g., tests, storybook) continue to work without modification.

### 3. List refresh via existing `fetchMeetings` callback

**Decision:** `onDeleteMeeting` in `page.tsx` calls `deleteMeeting(id)` then `fetchMeetings()`.

**Rationale:** `fetchMeetings` already handles loading/error state correctly. Reusing it keeps the state management logic in one place and avoids duplicating `setLoading`/`setError` logic.

**Alternative:** Optimistic removal (`setMeetings(prev => prev.filter(...))`) — deferred as non-goal; a full refetch is simpler and correct.

## Risks / Trade-offs

- **Race condition on rapid deletes**: Multiple simultaneous delete clicks could cause a stale refetch. Mitigation: out of scope for this task; a loading state per-card would address it.
- **No confirmation dialog**: User can accidentally delete meetings. Mitigation: acceptable for this sprint; UX polish is deferred.
- **404 on already-deleted meeting**: If the user double-clicks fast, the second delete returns 404. Mitigation: the client throws and `console.error`s — no user-visible crash because `fetchMeetings` still runs after the error propagates (or the error is caught at the call site).
