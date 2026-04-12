## ADDED Requirements

### Requirement: Meetings list fetches one page at a time
The client SHALL fetch meetings using `page` and `limit` query parameters instead of a hardcoded `?limit=100`. The default page size SHALL be 10 meetings per page.

#### Scenario: First page fetched on mount
- **WHEN** the meetings page mounts
- **THEN** the API is called with `page=1` and `limit` defaulting to 10

#### Scenario: Page param sent on navigation
- **WHEN** the user selects page 2 via the Pagination component
- **THEN** `listMeetings` is called with `{ page: 2 }`

### Requirement: MUI Pagination component rendered below meeting list
The page SHALL render an MUI `Pagination` component below the `MeetingList` when `totalPages > 1`.

#### Scenario: Pagination visible with multiple pages
- **WHEN** the API returns a response where `totalPages > 1`
- **THEN** the `Pagination` component is present in the DOM

#### Scenario: Pagination hidden for single page of results
- **WHEN** the API returns a response where `totalPages <= 1`
- **THEN** no `Pagination` component is rendered in the DOM

### Requirement: Page resets to 1 after create
After successfully creating a new meeting, the page SHALL reset to page 1 and refetch.

#### Scenario: Create navigates to page 1
- **WHEN** a new meeting is created
- **THEN** `fetchMeetings` is called with page 1

### Requirement: Current page refetched after delete
After successfully deleting a meeting, the page SHALL refetch the current page (not reset to page 1).

#### Scenario: Delete stays on current page
- **WHEN** a meeting is deleted while on page 2
- **THEN** `fetchMeetings` is called with page 2

### Requirement: listMeetings returns full PaginatedResponse
`listMeetings` SHALL accept optional `page`, `limit`, and `title` params and return the complete `PaginatedResponse` object (not just `docs`).

#### Scenario: Return shape includes totalPages and docs
- **WHEN** `listMeetings({ page: 1 })` resolves
- **THEN** the resolved value contains both `docs` (Meeting array) and `totalPages` (number)
