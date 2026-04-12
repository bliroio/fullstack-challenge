## 1. Write Tests (Red Phase)

- [x] 1.1 Create `client/app/__tests__/page.test.tsx` with four tests: loading spinner, error message, empty state, and meetings displayed

## 2. Update page.tsx

- [x] 2.1 Add `loading` state (initialized to `true`) and `error` state (initialized to `null`) to `Home`
- [x] 2.2 Convert `fetchMeetings` to async with try/catch/finally managing loading and error state
- [x] 2.3 Pass `loading` and `error` as props to `MeetingList`

## 3. Update meetingList.tsx

- [x] 3.1 Add `Alert`, `Box`, `CircularProgress` to MUI imports
- [x] 3.2 Add `loading: boolean` and `error: string | null` to Props type
- [x] 3.3 Add early-return for loading state: centered orange `CircularProgress`
- [x] 3.4 Add early-return for error state: MUI `Alert` with severity "error"
- [x] 3.5 Add early-return for empty state: centered "No meetings found" text

## 4. Verify

- [x] 4.1 Run `cd client && npx vitest run` — all four page tests pass
- [x] 4.2 Run `cd client && npx tsc --noEmit` — zero TypeScript errors
