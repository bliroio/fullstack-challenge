# Async Error Handling

## Purpose

Provides the asyncHandler wrapper and AppError class so that async Express controllers propagate errors cleanly without try/catch boilerplate.

## Requirements

### Requirement: asyncHandler wraps async controllers for automatic error forwarding
The `asyncHandler` utility SHALL wrap Express async route handlers so that any thrown error or rejected promise is automatically forwarded to `next(error)` without requiring explicit try/catch in controllers.

#### Scenario: Successful handler returns normally
- **WHEN** an asyncHandler-wrapped handler completes without throwing
- **THEN** the response SHALL be sent normally

#### Scenario: Thrown error is forwarded to next
- **WHEN** an asyncHandler-wrapped handler throws an error or rejects
- **THEN** the error SHALL be forwarded to Express's error handler via `next(error)`
- **THEN** no try/catch is required in the handler body

### Requirement: AppError class carries HTTP status code
The `AppError` class SHALL extend `Error` and carry a `statusCode` property so that the global error handler can return the correct HTTP status for known operational errors.

#### Scenario: AppError is constructible with status and message
- **WHEN** code executes `new AppError(404, "Meeting not found")`
- **THEN** the resulting object SHALL have `statusCode === 404`
- **THEN** the resulting object SHALL have `message === "Meeting not found"`
- **THEN** `err instanceof AppError` SHALL be true
- **THEN** `err instanceof Error` SHALL be true

### Requirement: Controllers use asyncHandler with no try/catch
All Express route handlers SHALL be wrapped with `asyncHandler`. Controllers SHALL NOT contain try/catch blocks — error propagation is handled entirely by the wrapper and global error handler.

#### Scenario: listMeetings controller uses asyncHandler
- **WHEN** `listMeetings` is called and the service succeeds
- **THEN** the response SHALL return the meeting list as JSON
- **THEN** the handler body SHALL NOT contain explicit try/catch

#### Scenario: listMeetings controller error propagates to global handler
- **WHEN** `listMeetings` is called and the service throws
- **THEN** the error SHALL reach the global error handler
- **THEN** the client SHALL receive the appropriate error response (generic 500 or AppError status)
