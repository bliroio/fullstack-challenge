## Why

The `POST /api/meetings` endpoint does not exist, so every attempt to create a meeting from the UI results in a 404. This is a release blocker: the create-meeting form has been built but submits to nothing.

## What Changes

- Add `createMeeting` function to `meetingService.ts` — persists a new meeting document to MongoDB
- Add `createMeeting` controller to `meetingController.ts` — handles HTTP 201 response
- Add `POST /` route to `meetingRoutes.ts` — wires validation middleware with `createMeetingSchema` before the controller
- Add integration test file `server/src/__tests__/meetings.post.test.ts` with property-based and edge-case tests using `fast-check` and `supertest`

## Capabilities

### New Capabilities

- `meeting-create`: POST /api/meetings endpoint that validates input with `createMeetingSchema`, creates a meeting document in MongoDB, and returns HTTP 201 with the persisted document

### Modified Capabilities

- `request-validation-middleware`: The existing validate middleware is now applied to the POST route (no requirement changes, only usage)

## Impact

- **API**: New `POST /api/meetings` route becomes available
- **Files modified**: `server/src/services/meetingService.ts`, `server/src/controllers/meetingController.ts`, `server/src/routes/meetingRoutes.ts`
- **Files created**: `server/src/__tests__/meetings.post.test.ts`
- **Dependencies used**: `shared/schemas/meeting` (`createMeetingSchema`, `CreateMeetingInput`), `server/src/middleware/validate` (`validate`), `server/src/utils/asyncHandler`
- **No breaking changes** — existing GET endpoint is untouched
