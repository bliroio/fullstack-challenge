## Why

The app supports creating and deleting meetings but has no way to update them. Users who make a mistake or need to change a meeting title or time must delete and recreate it, which is error-prone and disruptive. Adding an edit capability closes this gap with minimal new surface area by reusing the existing create drawer and form.

## What Changes

- New `PUT /api/meetings/:id` endpoint on the server for updating an existing meeting
- New `updateMeeting` service function that validates the ID, updates via Mongoose with `runValidators: true`, and throws typed `AppError` for 400/404 cases
- New `updateMeeting` controller using the existing `asyncHandler` wrapper
- New `updateMeeting` client service function that calls the PUT endpoint
- Edit (pencil) icon button added to each meeting card in `MeetingList`
- Existing create drawer reused in "edit mode": accepts an optional `meetingToEdit` prop, prefills form fields via react-hook-form `reset()`, and shows "Edit meeting" in the header
- `page.tsx` gains `selectedMeeting` state and a unified `onSubmitMeeting` handler that routes to create or update based on whether a meeting is selected

## Capabilities

### New Capabilities

- `meeting-edit`: PUT endpoint and client edit flow — edit button on meeting cards opens the existing drawer prefilled with current meeting data; submitting calls PUT and refreshes the list

### Modified Capabilities

- `meeting-create`: The create drawer is extended to optionally operate in edit mode; the header and form accept new optional props but existing create behavior is unchanged

## Impact

- **Server**: `meetingService.ts`, `meetingController.ts`, `meetingRoutes.ts`
- **Client**: `page.tsx`, `header.tsx`, `meetingList.tsx`, `CreateMeetingDrawer.tsx`, `CreateMeetingForm.tsx`, `CreateMeetingHeader.tsx`
- **Shared**: No changes — `Meeting` type and Zod schemas remain unchanged
- **APIs**: Adds `PUT /api/meetings/:id`; existing `GET`, `POST`, `DELETE` endpoints unchanged
- **Dependencies**: No new packages — uses existing MUI icons, react-hook-form `reset()`, axios
