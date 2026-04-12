## MODIFIED Requirements

### Requirement: Server title search escapes regex metacharacters
The `listMeetings` function in `server/src/services/meetingService.ts` SHALL escape all regex metacharacters in the `title` parameter using `escapeRegExp` before passing it to a native `RegExp` constructor, so that user input is always treated as a literal substring match.

#### Scenario: Literal dot in title search is not treated as wildcard
- **WHEN** a request is made with `title=stand.up`
- **THEN** MongoDB searches for the literal string `stand.up` and does NOT match titles like `standup` or `standXup`

#### Scenario: Match-all pattern does not return all meetings
- **WHEN** a request is made with `title=.*`
- **THEN** the service searches for the literal string `.*` and returns only meetings whose title contains that exact substring (not all meetings)

#### Scenario: Normal title search still works
- **WHEN** a request is made with `title=standup`
- **THEN** the service returns meetings whose title contains `standup` (case-insensitive)

#### Scenario: Empty title parameter returns all meetings
- **WHEN** a request is made without a `title` parameter (or with an empty value)
- **THEN** no title filter is applied and all meetings are returned (paginated)

### Requirement: listMeetings uses typed query interface
The `listMeetings` function in `server/src/services/meetingService.ts` SHALL accept a typed `ListMeetingsQuery` parameter (`{ page: number; limit: number; title?: string }`) instead of `query: any`, ensuring only known fields are destructured and passed to MongoDB.

#### Scenario: Unknown query parameters are not forwarded to MongoDB
- **WHEN** a request is made with unknown query parameters such as `foo=bar`
- **THEN** the `foo` parameter is NOT passed to MongoDB as a filter condition
- **AND** the response returns meetings as if `foo` was not present

#### Scenario: page and limit are used directly without parseInt
- **WHEN** `listMeetings({ page: 2, limit: 5, title: undefined })` is called
- **THEN** the Mongoose paginate call receives `page: 2` and `limit: 5` as numbers (no string parsing)
