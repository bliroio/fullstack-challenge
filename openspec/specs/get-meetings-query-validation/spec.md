## Purpose

Ensures that all query parameters on the `GET /api/meetings` route are validated, coerced, defaulted, and bounds-checked before reaching the controller.

## Requirements

### Requirement: GET /api/meetings validates query parameters
The system SHALL apply `validate(listQuerySchema, "query")` middleware to the `GET /api/meetings` route. The middleware SHALL run before the `listMeetings` controller and SHALL coerce, default, and bounds-check all query parameters.

#### Scenario: Default pagination when no params provided
- **WHEN** a GET request is made to `/api/meetings` with no query parameters
- **THEN** the response has HTTP 200 and the body contains `page: 1` and `limit: 10`

#### Scenario: Valid params pass through to the controller
- **WHEN** a GET request is made to `/api/meetings?page=2&limit=5&title=standup`
- **THEN** the response has HTTP 200 and the paginated result reflects page 2 with at most 5 items filtered by title containing "standup"

#### Scenario: Negative page is rejected
- **WHEN** a GET request is made to `/api/meetings?page=-1`
- **THEN** the response has HTTP 400 with `{ message: "Validation failed", errors: { page: ["Number must be greater than or equal to 1"] } }`

#### Scenario: Limit exceeding 100 is rejected
- **WHEN** a GET request is made to `/api/meetings?limit=999999`
- **THEN** the response has HTTP 400 with `{ message: "Validation failed", errors: { limit: ["Number must be less than or equal to 100"] } }`

#### Scenario: Non-numeric page is rejected
- **WHEN** a GET request is made to `/api/meetings?page=abc`
- **THEN** the response has HTTP 400

#### Scenario: Title exceeding 200 characters is rejected
- **WHEN** a GET request is made to `/api/meetings` with a `title` query parameter longer than 200 characters
- **THEN** the response has HTTP 400 with `{ message: "Validation failed", errors: { title: ["String must contain at most 200 character(s)"] } }`

### Requirement: Page is always >= 1 for any accepted request
The system SHALL guarantee that any 200 response from `GET /api/meetings` contains a `page` value greater than or equal to 1, regardless of what numeric value was supplied.

#### Scenario: Property — page in response is always >= 1
- **WHEN** any GET request to `/api/meetings?page=<n>` receives HTTP 200
- **THEN** `response.body.page` is greater than or equal to 1

### Requirement: Limit is always <= 100 for any accepted request
The system SHALL guarantee that any 200 response from `GET /api/meetings` contains a `limit` value less than or equal to 100, regardless of what numeric value was supplied.

#### Scenario: Property — limit in response is always <= 100
- **WHEN** any GET request to `/api/meetings?limit=<n>` receives HTTP 200
- **THEN** `response.body.limit` is less than or equal to 100
