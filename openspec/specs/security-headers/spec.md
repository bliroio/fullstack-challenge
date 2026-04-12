# Security Headers

## Purpose

Applies Helmet middleware globally to set standard security headers on all HTTP responses.

## Requirements

### Requirement: Secure HTTP headers on all responses
The server SHALL apply Helmet middleware globally so that every HTTP response includes the standard set of security headers.

#### Scenario: X-Content-Type-Options header present
- **WHEN** a client sends any request to the server
- **THEN** the response SHALL include the header `X-Content-Type-Options: nosniff`

#### Scenario: X-Frame-Options header present
- **WHEN** a client sends any request to the server
- **THEN** the response SHALL include the header `X-Frame-Options: SAMEORIGIN`

#### Scenario: X-DNS-Prefetch-Control header present
- **WHEN** a client sends any request to the server
- **THEN** the response SHALL include the header `X-DNS-Prefetch-Control: off`
