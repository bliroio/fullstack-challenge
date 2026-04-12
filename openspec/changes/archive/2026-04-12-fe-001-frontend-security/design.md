## Context

The Next.js frontend at `client/` currently serves responses with no security headers. The `next.config.js` is an empty config object. The meeting service (`client/app/services/meetingService.ts`) fetches data via axios and passes it directly to the UI without validation, trusting the server implicitly.

The backend already uses `helmet` for its own response headers (BE-000), and shared Zod schemas exist at `shared/schemas/meeting.ts` (ALL-006). This change brings the frontend to parity on security posture.

## Goals / Non-Goals

**Goals:**
- Serve security headers on all Next.js responses to mitigate common web vulnerabilities
- Validate API responses with Zod before they reach UI components
- Follow TDD: write test for security headers before implementing

**Non-Goals:**
- Content Security Policy (CSP) -- requires careful tuning for MUI inline styles, Google Fonts, and Next.js scripts; deferred
- CSRF protection -- no authentication system exists
- Subresource Integrity (SRI) -- impractical for external CDN resources
- Changing any API contracts or server behavior

## Decisions

**1. Use `next.config.js` `headers()` instead of custom middleware**
- Rationale: Next.js has first-class support for response headers via the `headers()` async function in config. This is simpler, more discoverable, and applies to all routes (including static assets) without custom code.
- Alternative considered: Next.js middleware (`middleware.ts`) could set headers per-request, but adds runtime overhead and complexity for what is a static configuration.

**2. `X-Frame-Options: DENY` instead of `SAMEORIGIN`**
- Rationale: The frontend has no legitimate iframe embedding use case. The backend uses `SAMEORIGIN` (helmet default) because Swagger UI uses iframes. The frontend can be more restrictive.

**3. Validate responses with `meetingSchema.parse()` rather than `.safeParse()`**
- Rationale: A malformed API response is an exceptional error that should propagate to the error boundary, not be silently handled. Using `.parse()` throws a ZodError with clear diagnostics. The caller's existing `try/catch` blocks handle error propagation.

**4. Import from `@shared/schemas/meeting` path alias**
- Rationale: The project uses TypeScript path aliases for shared schemas (established in ALL-006). If the alias is not yet configured for the client, the import will use the relative path to `shared/schemas/meeting.ts`.

## Risks / Trade-offs

- [Risk] Zod validation could reject valid responses if schema drifts from actual API shape. -> Mitigation: Both server and client use the same shared `meetingSchema`, so drift is structurally prevented.
- [Risk] `X-Frame-Options` is deprecated in favor of CSP `frame-ancestors`. -> Mitigation: Still widely supported by browsers as a fallback. CSP is explicitly deferred to a future change.
- [Trade-off] `parse()` throws on invalid data instead of returning a result object. -> Accepted: failing fast is the correct behavior for API response validation; silent failures are worse.
