## 1. Implementation

- [x] 1.1 In `server/src/services/meetingService.ts`, change `sort: { startTime: -1 }` to `sort: { startTime: 1 }`

## 2. Verification

- [x] 2.1 Confirm the server starts without errors after the change
- [x] 2.2 Confirm the meetings list returns meetings ordered by `startTime` ascending (earliest first)
