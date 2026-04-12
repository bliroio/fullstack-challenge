## 1. Server — Service Layer

- [x] 1.1 Add `updateMeeting(id, data)` function to `server/src/services/meetingService.ts` — validate ObjectId, call `findByIdAndUpdate` with `{ new: true, runValidators: true }`, throw `AppError(400)` on invalid ID, `AppError(404)` on missing document

## 2. Server — Controller Layer

- [x] 2.1 Add `updateMeeting` controller to `server/src/controllers/meetingController.ts` using `asyncHandler`, calling `meetingService.updateMeeting(req.params.id, req.body)` and returning `res.json(meeting)`

## 3. Server — Routing

- [x] 3.1 Add `updateMeeting` to the import from `"../controllers/meetingController"` in `server/src/routes/meetingRoutes.ts`
- [x] 3.2 Add `router.put("/:id", updateMeeting)` route at end of `meetingRoutes.ts`

## 4. Client — Service Layer

- [x] 4.1 Add `updateMeeting(id, meeting)` function to `client/app/services/meetingService.ts` — call `axios.put<Meeting>` against `${API_BASE_URL}/meetings/${id}` (note: `API_BASE_URL` in this file is `http://localhost:3000/api/meetings`, so use `API_BASE_URL.replace('/meetings','') + '/meetings/' + id` or adjust path accordingly — check the file's `API_BASE_URL` value and use the correct path)

## 5. Client — MeetingList Edit Button

- [x] 5.1 Add `onEdit?: (meeting: Meeting) => void` to `Props` type in `client/app/components/meetingList.tsx`
- [x] 5.2 Destructure `onEdit` in the component signature
- [x] 5.3 Import `EditOutlinedIcon` from `"@mui/icons-material/EditOutlined"`
- [x] 5.4 Wrap the existing delete `IconButton` and a new edit `IconButton` in a `<div style={{ display: 'flex', gap: '4px' }}>` — edit button uses blue hover (`#3B82F6` / `#EFF6FF`), delete keeps red hover

## 6. Client — CreateMeetingHeader Edit Mode

- [x] 6.1 Add `isEditing?: boolean` to `DrawerHeaderProps` interface in `CreateMeetingHeader.tsx`
- [x] 6.2 Destructure `isEditing` in component signature
- [x] 6.3 Replace static "Create a new meeting" title text with `{isEditing ? "Edit meeting" : "Create a new meeting"}`
- [x] 6.4 Replace static description text with `{isEditing ? "Update the meeting details below." : "Complete the information below in order to create a new meeting."}`

## 7. Client — CreateMeetingForm Prefill

- [x] 7.1 Add `meeting?: Meeting` to `CreateMeetingFormProps` interface in `CreateMeetingForm.tsx`
- [x] 7.2 Destructure `meeting` in component function signature
- [x] 7.3 Import `useEffect` from React
- [x] 7.4 Add `useEffect` after `useForm` call that calls `reset({ title, startTime: new Date(meeting.startTime), endTime: new Date(meeting.endTime) })` when `meeting` changes

## 8. Client — CreateMeetingDrawer Pass-through

- [x] 8.1 Add `meetingToEdit?: Meeting` to `CreateMeetingDrawerProps` interface in `CreateMeetingDrawer.tsx`
- [x] 8.2 Destructure `meetingToEdit` in component signature
- [x] 8.3 Pass `isEditing={!!meetingToEdit}` to `<CreateMeetingHeader>`
- [x] 8.4 Pass `meeting={meetingToEdit}` to `<CreateMeetingForm>`

## 9. Client — Header Wire-up

- [x] 9.1 Add `meetingToEdit?: Meeting | null` and `onDrawerClose?: () => void` to `Props` type in `header.tsx`
- [x] 9.2 Destructure new props in component signature
- [x] 9.3 Add `useEffect` import alongside existing `useState` import
- [x] 9.4 Add `useEffect(() => { if (meetingToEdit) setDrawerOpen(true); }, [meetingToEdit])` after the existing `useState`
- [x] 9.5 Extract `handleDrawerClose` function: `setDrawerOpen(false); onDrawerClose?.();`
- [x] 9.6 Update `handleCreateMeeting` to call `handleDrawerClose()` instead of `setDrawerOpen(false)` on success
- [x] 9.7 Update `<CreateMeetingDrawer>` to use `onClose={handleDrawerClose}` and pass `meetingToEdit={meetingToEdit || undefined}`

## 10. Client — Page Wiring

- [x] 10.1 Add `updateMeeting` to the import from `"./services/meetingService"` in `page.tsx`
- [x] 10.2 Add `const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)` state
- [x] 10.3 Replace `onCreateMeeting` handler with `onSubmitMeeting` — calls `updateMeeting(selectedMeeting.id, meeting)` if `selectedMeeting` is set, otherwise `createMeeting(meeting)`; always calls `fetchMeetings()` after
- [x] 10.4 Add `onEditMeeting = (meeting: Meeting) => setSelectedMeeting(meeting)`
- [x] 10.5 Add `onDrawerClose = () => setSelectedMeeting(null)`
- [x] 10.6 Update `<Header>` JSX: replace `onCreateMeeting={onCreateMeeting}` with `onCreateMeeting={onSubmitMeeting}`, add `meetingToEdit={selectedMeeting}` and `onDrawerClose={onDrawerClose}`
- [x] 10.7 Update `<MeetingList>` JSX: add `onEdit={onEditMeeting}`
