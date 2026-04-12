## ADDED Requirements

### Requirement: escapeRegExp escapes all regex metacharacters
The `escapeRegExp` function exported from `server/src/utils/escapeRegExp.ts` SHALL escape all 12 regex metacharacters (`. * + ? ^ $ { } ( ) | [ ] \`) by prepending a backslash, so that the resulting string, when used inside `new RegExp()` or MongoDB's `$regex` operator, matches only the literal input characters.

#### Scenario: All 12 metacharacters are escaped
- **WHEN** `escapeRegExp(".*+?^${}()|[]\\")` is called
- **THEN** the result is `"\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\"`

#### Scenario: Normal characters are not modified
- **WHEN** `escapeRegExp("hello world 123")` is called
- **THEN** the result is `"hello world 123"` (unchanged)

#### Scenario: Mixed metacharacters and normal text are handled correctly
- **WHEN** `escapeRegExp("stand.up")` is called
- **THEN** the result is `"stand\\.up"`

#### Scenario: Empty string input returns empty string
- **WHEN** `escapeRegExp("")` is called
- **THEN** the result is `""`

### Requirement: escapeRegExp output is safe for use in RegExp constructor
The output of `escapeRegExp` SHALL be usable as a literal match pattern inside `new RegExp()` such that the regex matches only the original input string and nothing else.

#### Scenario: Escaped dangerous input matches only itself
- **WHEN** `new RegExp(escapeRegExp(".*+?^${}()|[]\\"))` is constructed and tested against the original input
- **THEN** the regex matches the original input and does NOT match `"anything else"`

### Requirement: escapeRegExp prevents ReDoS patterns
User input containing catastrophic backtracking patterns SHALL be escaped so the pattern is treated as a literal string by the regex engine, preventing denial of service.

#### Scenario: ReDoS pattern is neutralized
- **WHEN** `escapeRegExp(".*.*.*.*.*.*.*.*a")` is called and wrapped in `new RegExp()`
- **THEN** the regex matches only the literal string `".*.*.*.*.*.*.*.*a"` and does NOT match `"a"`

### Requirement: escapeRegExp prevents match-all bypass
User input of `.*` SHALL NOT be interpreted as a match-all wildcard when passed to MongoDB `$regex` or `new RegExp()`.

#### Scenario: Match-all bypass is prevented
- **WHEN** `escapeRegExp(".*")` is called and wrapped in `new RegExp()`
- **THEN** the regex does NOT match `"hello"` and DOES match only `".*"`

### Requirement: escapeRegExp utility has unit test coverage
A test file SHALL exist at `server/src/utils/__tests__/escapeRegExp.test.ts` covering all metacharacters, ReDoS patterns, match-all bypass, empty string, and literal match behavior.

#### Scenario: All unit tests pass
- **WHEN** `npx vitest run server/src/utils/__tests__/escapeRegExp.test.ts` is executed in the server directory
- **THEN** all tests pass with no failures
