## Why

The application currently has no way to remove meetings — users can create meetings but cannot delete them. This leaves the list cluttered with stale or cancelled entries and blocks the core meeting management workflow.

## What Changes

- Add `DELETE /api/meetings/:id` endpoint to the Express server, returning 204 on success, 404 if not found, 400 for invalid ID format.
- Add `deleteMeeting` service function that validates the ID with `mongoose.Types.ObjectId.isValid()` and throws `AppError` for 400/404 cases.
- Add `deleteMeeting` controller using `asyncHandler` — no try/catch needed in the controller.
- Register the DELETE route in `meetingRoutes.ts`.
- Add `deleteMeeting` client service function in `client/app/services/meetingService.ts`.
- Add `onDelete` prop to `MeetingList` component and render a `DeleteOutlineIcon` `IconButton` on each meeting card.
- Add `onDeleteMeeting` handler in `page.tsx` that calls the client service and refreshes the list.
- Write integration tests in `server/src/__tests__/meetings.delete.test.ts` (TDD: tests written first).

## Capabilities

### New Capabilities

- `meeting-delete`: REST endpoint and client UI for deleting a single meeting by ID, including ID validation, 404 handling, and optimistic list refresh.

### Modified Capabilities

- `meeting-create`: No requirement changes — implementation pattern is reused but spec is unchanged.

## Impact

- **Server**: `server/src/services/meetingService.ts`, `server/src/controllers/meetingController.ts`, `server/src/routes/meetingRoutes.ts`
- **Client**: `client/app/services/meetingService.ts`, `client/app/page.tsx`, `client/app/components/meetingList.tsx`
- **Tests**: new file `server/src/__tests__/meetings.delete.test.ts`
- **Dependencies**: `@mui/icons-material` (already installed), `AppError` utility (already exists at `server/src/utils/AppError.ts`), `asyncHandler` (already exists)
- **No breaking changes** — new endpoint and UI addition only
