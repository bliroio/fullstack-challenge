## ADDED Requirements

### Requirement: Missing MONGODB_URI causes a fail-fast error at server startup
The server SHALL throw a descriptive error at module load time if `MONGODB_URI` is not set, rather than silently falling back to a non-functional connection string. The error message SHALL reference `.env.example` to guide the developer.

#### Scenario: Server fails fast with clear message when MONGODB_URI is missing
- **WHEN** the server process starts and `MONGODB_URI` is not set in the environment
- **THEN** the process throws `MONGODB_URI environment variable is not set. Copy .env.example to .env and fill in your MongoDB connection string.` and terminates immediately

#### Scenario: Server starts normally when MONGODB_URI is set
- **WHEN** `MONGODB_URI` is set to a valid MongoDB connection string
- **THEN** the `db.ts` module loads without error and `connectDB()` connects successfully
