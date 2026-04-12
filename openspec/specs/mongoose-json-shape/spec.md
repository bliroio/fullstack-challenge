## ADDED Requirements

### Requirement: Meeting JSON omits MongoDB internals and exposes id as string
All JSON-serialized meeting documents SHALL include an `id` field (string representation of the ObjectId) and SHALL NOT include `_id` or `__v` fields.

#### Scenario: GET /api/meetings response shape
- **WHEN** a client sends `GET /api/meetings`
- **THEN** each meeting object in the `docs` array SHALL have an `id` string field
- **THEN** each meeting object SHALL NOT have an `_id` field
- **THEN** each meeting object SHALL NOT have a `__v` field
- **THEN** each meeting object SHALL have `title`, `startTime`, and `endTime` fields

#### Scenario: Single meeting serialization
- **WHEN** any route returns a single meeting document via `res.json()`
- **THEN** the serialized object SHALL contain `id` (string) and SHALL NOT contain `_id` or `__v`
