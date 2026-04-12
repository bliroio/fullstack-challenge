## ADDED Requirements

### Requirement: Server rejects JSON request bodies exceeding 1 MB
The server SHALL reject any incoming request whose JSON body exceeds 1 megabyte (1,048,576 bytes) with HTTP status 413 (Payload Too Large) before the request reaches any route handler or downstream middleware.

#### Scenario: Oversized body is rejected with 413
- **WHEN** a POST request is sent with a `Content-Type: application/json` body larger than 1 MB
- **THEN** the server SHALL respond with HTTP status 413 and SHALL NOT invoke any route handler

#### Scenario: Body at or below the limit is accepted
- **WHEN** a POST request is sent with a `Content-Type: application/json` body of 1 MB or less
- **THEN** the server SHALL process the request normally and SHALL NOT return 413
