## 1. Tests (TDD — Red Phase)

- [x] 1.1 Create `server/src/__tests__/meetings.delete.test.ts` with integration tests covering: 204 on success, 404 for non-existent ID, 400 for invalid ID format

## 2. Server — Service

- [x] 2.1 Add `import { AppError } from "../utils/AppError"` to `server/src/services/meetingService.ts`
- [x] 2.2 Append `deleteMeeting(id: string)` function to `server/src/services/meetingService.ts`: validate ID with `mongoose.Types.ObjectId.isValid()`, throw `AppError(400)` if invalid, call `Meeting.findByIdAndDelete(id)`, throw `AppError(404, "Meeting not found")` if null

## 3. Server — Controller

- [x] 3.1 Append `deleteMeeting` controller to `server/src/controllers/meetingController.ts` using `asyncHandler`: call `meetingService.deleteMeeting(req.params.id)`, return `res.status(204).send()`

## 4. Server — Route

- [x] 4.1 Add `deleteMeeting` to the import from `../controllers/meetingController` in `server/src/routes/meetingRoutes.ts`
- [x] 4.2 Register `router.delete("/:id", deleteMeeting)` after the existing POST route

## 5. Client — Service

- [x] 5.1 Append `deleteMeeting(id: string): Promise<void>` to `client/app/services/meetingService.ts` using `axios.delete`

## 6. Client — Page

- [x] 6.1 Add `deleteMeeting` to the import from `./services/meetingService` in `client/app/page.tsx`
- [x] 6.2 Add `onDeleteMeeting` handler inside `Home` component: calls `await deleteMeeting(id)` then `fetchMeetings()`
- [x] 6.3 Pass `onDelete={onDeleteMeeting}` to the `<MeetingList>` element

## 7. Client — MeetingList Component

- [x] 7.1 Add `import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"` and add `IconButton` to the MUI import in `client/app/components/meetingList.tsx`
- [x] 7.2 Add `onDelete?: (id: string) => void` to the `Props` type
- [x] 7.3 Destructure `onDelete` in the component signature
- [x] 7.4 Wrap existing card content in a flex row (`justifyContent: space-between`), move text content into an inner column div
- [x] 7.5 Conditionally render `<IconButton>` with `<DeleteOutlineIcon>` when `onDelete` is provided; call `onDelete(meeting.id)` on click

## 8. Verification

- [x] 8.1 Run `cd /Users/paul/repos/fullstack-challenge/server && npx vitest run` — all delete tests pass (green phase)
- [x] 8.2 Run `cd /Users/paul/repos/fullstack-challenge/server && npx tsc --noEmit` — no TypeScript errors
- [x] 8.3 Run `cd /Users/paul/repos/fullstack-challenge/client && npx tsc --noEmit` — no TypeScript errors
