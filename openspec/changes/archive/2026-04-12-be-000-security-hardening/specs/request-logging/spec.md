## ADDED Requirements

### Requirement: HTTP request logging for all inbound requests
The server SHALL log all inbound HTTP requests using Morgan middleware.

#### Scenario: Development environment uses dev format
- **WHEN** `NODE_ENV` is not set to `"production"` and a request is received
- **THEN** the request SHALL be logged to stdout in Morgan `"dev"` format (method, URL, status, response time)

#### Scenario: Production environment uses combined format
- **WHEN** `NODE_ENV` is set to `"production"` and a request is received
- **THEN** the request SHALL be logged to stdout in Morgan `"combined"` format (includes remote IP, user-agent, referrer)
