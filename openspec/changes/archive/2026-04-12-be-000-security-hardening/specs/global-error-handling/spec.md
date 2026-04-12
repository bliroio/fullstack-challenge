## ADDED Requirements

### Requirement: Generic error response for unknown errors
The server SHALL NOT expose internal error details, stack traces, or database error messages in HTTP responses.

#### Scenario: Unknown error returns generic 500
- **WHEN** an unhandled error (not an AppError) propagates to the global error handler
- **THEN** the response SHALL have HTTP status 500
- **THEN** the response body SHALL be exactly `{ "message": "Internal server error" }`
- **THEN** the response body SHALL NOT contain a `stack` property
- **THEN** the response body SHALL NOT contain the original error message

### Requirement: Operational errors return correct HTTP status
The server SHALL return the status code and message from AppError instances for known operational errors.

#### Scenario: AppError with 404 returns 404
- **WHEN** a controller or service throws `new AppError(404, "Meeting not found")`
- **THEN** the response SHALL have HTTP status 404
- **THEN** the response body SHALL be `{ "message": "Meeting not found" }`

#### Scenario: AppError with 400 returns 400
- **WHEN** a controller or service throws `new AppError(400, "Invalid meeting ID")`
- **THEN** the response SHALL have HTTP status 400
- **THEN** the response body SHALL be `{ "message": "Invalid meeting ID" }`

### Requirement: No double-response when headers already sent
The server SHALL safely handle errors that occur after response headers have been sent.

#### Scenario: Headers already sent defers to Express default handler
- **WHEN** an error occurs after `res.headersSent` is true
- **THEN** the error SHALL be forwarded to Express's default error handler via `next(err)`
- **THEN** the server SHALL NOT throw or crash
