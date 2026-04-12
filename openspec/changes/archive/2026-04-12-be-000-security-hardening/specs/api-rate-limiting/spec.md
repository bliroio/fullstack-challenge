## ADDED Requirements

### Requirement: Per-IP rate limiting on API routes
The server SHALL enforce a rate limit of 100 requests per 15-minute window per IP address on all routes under `/api/`.

#### Scenario: Request within limit succeeds
- **WHEN** a client sends 100 or fewer requests to `/api/` within a 15-minute window
- **THEN** all requests SHALL receive a normal response (not 429)

#### Scenario: Request exceeding limit is rejected
- **WHEN** a client sends more than 100 requests to `/api/` within a 15-minute window
- **THEN** the 101st and subsequent requests SHALL receive HTTP 429 with a JSON body containing `{ "message": "Too many requests, please try again later" }`

#### Scenario: Rate limit headers present on responses
- **WHEN** a client sends a request to any `/api/` route
- **THEN** the response SHALL include standard rate-limit headers (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`) conforming to the draft-7 standard

#### Scenario: Non-API routes are not rate limited
- **WHEN** a client sends requests to routes outside `/api/` (e.g., `/api-docs`)
- **THEN** those requests SHALL NOT be subject to the API rate limiter
