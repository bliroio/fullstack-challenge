## ADDED Requirements

### Requirement: Meeting schema rejects endTime not after startTime
The Mongoose meeting schema SHALL include a validator on the `endTime` field that rejects any document where `endTime` is not strictly greater than `startTime`. This validation SHALL run on `Model.create()` and `document.save()` calls.

#### Scenario: Valid meeting is saved successfully
- **WHEN** a meeting document is created with `endTime` strictly after `startTime`
- **THEN** Mongoose SHALL accept the document and persist it without a validation error

#### Scenario: Meeting with endTime equal to startTime is rejected
- **WHEN** a meeting document is created with `endTime` equal to `startTime`
- **THEN** Mongoose SHALL throw a `ValidationError` with message "endTime must be after startTime"

#### Scenario: Meeting with endTime before startTime is rejected
- **WHEN** a meeting document is created with `endTime` before `startTime`
- **THEN** Mongoose SHALL throw a `ValidationError` with message "endTime must be after startTime"
