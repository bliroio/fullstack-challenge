## Purpose

Reusable Express middleware that validates incoming request data against Zod schemas, returning structured errors on failure and parsed/coerced data on success.

## Requirements

### Requirement: Validate request data against a Zod schema
The system SHALL provide a `validate(schema, source)` factory function that returns an Express middleware. The `source` parameter SHALL default to `"body"` and also accept `"query"`. On successful validation, the middleware SHALL replace `req[source]` with the Zod-parsed data and call `next()`. On validation failure, the middleware SHALL respond with HTTP 400 and a JSON body and SHALL NOT call `next()`.

#### Scenario: Valid body input passes through
- **WHEN** `validate(schema, "body")` receives a request whose `req.body` satisfies the schema
- **THEN** the middleware calls `next()` with no arguments and `req.body` is replaced with the parsed (coerced, defaulted) data

#### Scenario: Valid query input passes through
- **WHEN** `validate(schema, "query")` receives a request whose `req.query` satisfies the schema
- **THEN** the middleware calls `next()` with no arguments and `req.query` is replaced with the parsed data

#### Scenario: Invalid input returns 400 with field errors
- **WHEN** the middleware receives a request whose `req[source]` fails schema validation
- **THEN** the middleware responds with HTTP status 400 and a JSON body `{ message: "Validation failed", errors: <fieldErrors> }` where `fieldErrors` is an object keyed by field name containing arrays of error message strings

#### Scenario: Invalid input does not call next
- **WHEN** the middleware responds with 400 due to a validation failure
- **THEN** `next()` is NOT called

### Requirement: Coerce and default values on success
The system SHALL apply Zod's coercion and default transformations so that downstream handlers receive fully-typed values rather than raw strings.

#### Scenario: Numeric query strings are coerced to numbers
- **WHEN** `listQuerySchema` is used with `source="query"` and the request contains `page="5"` and `limit="20"` as strings
- **THEN** `req.query.page` equals the number `5` and `req.query.limit` equals the number `20` after the middleware runs
