## Why

The Next.js frontend serves HTML and assets with no security headers, leaving the app vulnerable to clickjacking, MIME-type sniffing, and unnecessary browser API exposure. Additionally, the client trusts API responses blindly -- if the server returns malformed data, it silently corrupts the UI instead of failing fast. Both issues are low-effort fixes with high security value.

## What Changes

- Configure Next.js security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `X-DNS-Prefetch-Control`, `Permissions-Policy`) via `next.config.js` `headers()` function, applied to all routes.
- Add Zod response validation in `meetingService.ts` using the shared `meetingSchema` so API responses are parsed and validated before reaching the UI layer.

## Capabilities

### New Capabilities
- `frontend-security-headers`: Security headers served on all Next.js responses to mitigate clickjacking, MIME sniffing, and unnecessary browser API access.
- `api-response-validation`: Zod-based validation of API responses in the meeting service, ensuring data integrity between server and client.

### Modified Capabilities

_None. No existing spec-level requirements are changing._

## Impact

- **Files modified**: `client/next.config.js`, `client/app/services/meetingService.ts`
- **New test file**: `client/app/__tests__/security-headers.test.ts`
- **Dependencies**: Uses shared `meetingSchema` from `shared/schemas/meeting.ts` (ALL-006)
- **APIs**: No API changes; this adds client-side validation of existing API responses
- **Risk**: Very low -- headers are additive and response validation only fails on genuinely malformed data
