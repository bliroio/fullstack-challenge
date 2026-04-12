## ADDED Requirements

### Requirement: Mongoose sanitizeFilter is enabled globally after connect
The application SHALL set `mongoose.set("sanitizeFilter", true)` after establishing the database connection, so that any `$` operators in filter values are wrapped with `$eq` to neutralize query selector injection.

#### Scenario: sanitizeFilter is active at runtime
- **WHEN** the database connection is established via `connectDB()`
- **THEN** `mongoose.get("sanitizeFilter")` SHALL return `true`

### Requirement: Mongoose strictQuery is enabled globally after connect
The application SHALL set `mongoose.set("strictQuery", true)` after establishing the database connection, so that filter fields not present in the schema are silently dropped rather than passed to MongoDB.

#### Scenario: strictQuery is active at runtime
- **WHEN** the database connection is established via `connectDB()`
- **THEN** `mongoose.get("strictQuery")` SHALL return `true`
