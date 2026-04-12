## 1. Tests (Red Phase)

- [x] 1.1 Create `client/app/components/__tests__/` directory
- [x] 1.2 Write `header.test.tsx` with two tests: debounce fires after 300ms, does not fire immediately

## 2. Service Layer

- [x] 2.1 Update `listMeetings` signature in `meetingService.ts` to accept `params?: { title?: string }`
- [x] 2.2 Add conditional URL append: when `params.title` is non-empty, append `&title=<encodeURIComponent(params.title)>`

## 3. Header Component

- [x] 3.1 Add `onSearch: (query: string) => void` to `Props` type in `header.tsx`
- [x] 3.2 Destructure `onSearch` from props
- [x] 3.3 Import `useCallback` and `useRef` from React
- [x] 3.4 Add `debounceTimerRef` using `useRef<ReturnType<typeof setTimeout> | null>(null)`
- [x] 3.5 Implement `handleSearchChange` that clears the previous timer and sets a 300ms timer calling `onSearch(value)`
- [x] 3.6 Add `onChange={handleSearchChange}` to the search TextField

## 4. Page Orchestration

- [x] 4.1 Import `useCallback` in `page.tsx`
- [x] 4.2 Add `searchQuery` state with `useState("")`
- [x] 4.3 Create `fetchMeetings` as a `useCallback` that calls `listMeetings(searchQuery ? { title: searchQuery } : undefined).then(setMeetings)`
- [x] 4.4 Create `onSearch` callback that calls `setSearchQuery`
- [x] 4.5 Update `onCreateMeeting` to call `fetchMeetings()` after creating (remove old chain pattern)
- [x] 4.6 Update `useEffect` to depend on `fetchMeetings`
- [x] 4.7 Pass `onSearch={onSearch}` to `<Header>`

## 5. Verification

- [x] 5.1 Run `cd client && npx vitest run` — all header tests pass
- [x] 5.2 Run `cd client && npx tsc --noEmit` — zero TypeScript errors
