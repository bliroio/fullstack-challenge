# NoSQL Injection Prevention

## Purpose
Sanitize incoming HTTP request data to prevent NoSQL injection attacks against MongoDB by stripping dangerous keys before they reach route handlers.

## Requirements

### Requirement: Strip dollar-sign operator keys from request data
The system SHALL recursively remove any key starting with `$` from objects in `req.body`, `req.query`, and `req.params` before route handlers execute.

#### Scenario: Dollar-sign key in request body is stripped
- **WHEN** a request body contains a key starting with `$` (e.g., `{ "$gt": "bad", "title": "ok" }`)
- **THEN** the sanitized body SHALL contain only `{ "title": "ok" }` — the `$gt` key SHALL be absent

#### Scenario: Nested dollar-sign key is stripped recursively
- **WHEN** a request body contains a nested object with a `$`-prefixed key (e.g., `{ "nested": { "$where": "evil" } }`)
- **THEN** the sanitized body SHALL contain `{ "nested": {} }` — the nested `$where` key SHALL be absent

### Requirement: Strip dot-notation keys from request data
The system SHALL recursively remove any key containing `.` from objects in `req.body`, `req.query`, and `req.params` before route handlers execute.

#### Scenario: Dot-notation key in request body is stripped
- **WHEN** a request body contains a dot-notation key (e.g., `{ "a.b": "bad", "title": "ok" }`)
- **THEN** the sanitized body SHALL contain only `{ "title": "ok" }` — the `a.b` key SHALL be absent

### Requirement: Preserve safe keys and primitive values
The system SHALL pass through all keys not starting with `$` and not containing `.`, and SHALL return primitive values (strings, numbers, booleans, null) unchanged.

#### Scenario: Safe keys are preserved
- **WHEN** a request body contains only safe keys (e.g., `{ "title": "standup", "duration": 30 }`)
- **THEN** the sanitized body SHALL equal `{ "title": "standup", "duration": 30 }` with no modifications

#### Scenario: Primitive values pass through unchanged
- **WHEN** a primitive value (string, number, null) is passed to the sanitize utility
- **THEN** the utility SHALL return the value unchanged

### Requirement: Sanitize array elements recursively
The system SHALL traverse arrays and apply the same sanitization rules to each element.

#### Scenario: Array elements with injection keys are sanitized
- **WHEN** `req.body` contains an array where one element has a `$`-prefixed key
- **THEN** the sanitized element SHALL have that key removed while other elements remain intact

### Requirement: Middleware executes after body parsing and before routes
The sanitizer middleware SHALL be registered in `app.ts` after `express.json()` and before any route handler registration, ensuring `req.body` is populated before sanitization occurs.

#### Scenario: Middleware order in app.ts
- **WHEN** the Express application initializes
- **THEN** `mongoSanitize()` SHALL appear in the middleware chain after `app.use(express.json())` and before `app.use("/api/meetings", meetingRoutes)`
