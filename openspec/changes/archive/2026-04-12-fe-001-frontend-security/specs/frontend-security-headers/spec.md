## ADDED Requirements

### Requirement: Security headers on all responses
The Next.js application SHALL serve security headers on all responses via the `headers()` configuration in `next.config.js`. The headers SHALL apply to all routes matching `/(.*).`

#### Scenario: X-Frame-Options header prevents clickjacking
- **WHEN** any page or asset is served by the Next.js application
- **THEN** the response SHALL include `X-Frame-Options: DENY`

#### Scenario: X-Content-Type-Options header prevents MIME sniffing
- **WHEN** any page or asset is served by the Next.js application
- **THEN** the response SHALL include `X-Content-Type-Options: nosniff`

#### Scenario: Referrer-Policy limits referrer leakage
- **WHEN** any page or asset is served by the Next.js application
- **THEN** the response SHALL include `Referrer-Policy: strict-origin-when-cross-origin`

#### Scenario: DNS prefetch control is enabled
- **WHEN** any page or asset is served by the Next.js application
- **THEN** the response SHALL include `X-DNS-Prefetch-Control: on`

#### Scenario: Permissions-Policy restricts browser APIs
- **WHEN** any page or asset is served by the Next.js application
- **THEN** the response SHALL include a `Permissions-Policy` header that disables `camera`, `microphone`, and `geolocation`
