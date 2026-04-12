## 1. Update meetingService.ts

- [x] 1.1 Export the `PaginatedResponse` type (change `type PaginatedResponse` to `export type PaginatedResponse`)
- [x] 1.2 Update `listMeetings` signature to accept `params?: { page?: number; limit?: number; title?: string }` and return `Promise<PaginatedResponse>`
- [x] 1.3 Replace the hardcoded `?limit=100` URL with dynamic URLSearchParams construction using `page`, `limit`, and `title` params
- [x] 1.4 Change the return value from `parseMeetings(response.data.docs)` to `response.data` (return full PaginatedResponse)

## 2. Update page.tsx state and fetch logic

- [x] 2.1 Add `import Pagination from "@mui/material/Pagination"` import
- [x] 2.2 Add `page` state: `const [page, setPage] = useState(1)`
- [x] 2.3 Add `totalPages` state: `const [totalPages, setTotalPages] = useState(1)`
- [x] 2.4 Update `fetchMeetings` to accept a `pageNum` argument (defaulting to current `page`) and pass it to `listMeetings`
- [x] 2.5 After `listMeetings` resolves, call `setMeetings(data.docs)`, `setTotalPages(data.totalPages)`, and `setPage(data.page)`
- [x] 2.6 Add `handlePageChange` handler that calls `fetchMeetings(value)` on page change
- [x] 2.7 Update `onCreateMeeting` post-create refetch to call `fetchMeetings(1)` (reset to page 1)
- [x] 2.8 Update `onDeleteMeeting` post-delete refetch to call `fetchMeetings(page)` (stay on current page)
- [x] 2.9 Update the `useEffect` initial fetch to call `fetchMeetings` with the current page

## 3. Add Pagination component to JSX

- [x] 3.1 After `<MeetingList .../>`, add `{totalPages > 1 && <Pagination count={totalPages} page={page} onChange={handlePageChange} sx={{ display: "flex", justifyContent: "center", paddingTop: "24px", paddingBottom: "24px" }} />}`

## 4. TypeScript validation

- [x] 4.1 Run `npx tsc --noEmit` in the `client` directory and confirm zero errors
