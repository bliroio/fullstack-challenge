## 1. TDD Setup (Red Phase)

- [x] 1.1 Create `client/app/__tests__/security-headers.test.ts` with tests that verify `next.config.js` exports a `headers()` function returning the expected security headers (X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, X-DNS-Prefetch-Control: on, Permissions-Policy)
- [x] 1.2 Run the test and confirm it fails (red)

## 2. Security Headers Implementation (Green Phase)

- [x] 2.1 Edit `client/next.config.js` to add an `async headers()` function returning security headers for the `/(.*)`source pattern
- [x] 2.2 Run the security headers test and confirm it passes (green)

## 3. API Response Validation

- [x] 3.1 Edit `client/app/services/meetingService.ts` to import `meetingSchema` from the shared schemas
- [x] 3.2 Add `parseMeeting` and `parseMeetings` helper functions using `meetingSchema.parse()`
- [x] 3.3 Update `listMeetings` to validate response with `parseMeetings(response.data.docs)`
- [x] 3.4 Update `createMeeting` to validate response with `parseMeeting(response.data)`

## 4. Verification

- [x] 4.1 Run all client tests to confirm no regressions
- [x] 4.2 Run `cd client && npm run build` to confirm TypeScript compiles successfully (pre-existing Next.js 500 page error unrelated to this change)
