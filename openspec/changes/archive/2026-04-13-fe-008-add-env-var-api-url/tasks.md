## 1. Update API_BASE_URL constant

- [x] 1.1 In `client/app/services/meetingService.ts`, change line 5 from `const API_BASE_URL = "http://localhost:3000/api/meetings"` to `const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"`

## 2. Update call sites to append /meetings path

- [x] 2.1 In `listMeetings`, update the URL template from `` `${API_BASE_URL}` `` to `` `${API_BASE_URL}/meetings` ``
- [x] 2.2 In `createMeeting`, update the axios.post call from `axios.post(API_BASE_URL, meeting)` to `` axios.post(`${API_BASE_URL}/meetings`, meeting) ``
- [x] 2.3 Verify `deleteMeeting` already uses `` `${API_BASE_URL}/${id}` `` and update to `` `${API_BASE_URL}/meetings/${id}` ``
- [x] 2.4 Verify `updateMeeting` already uses `` `${API_BASE_URL}/${id}` `` and update to `` `${API_BASE_URL}/meetings/${id}` ``

## 3. Verify

- [x] 3.1 Run `npx tsc --noEmit` in `client/` and confirm no TypeScript errors
