## ADDED Requirements

### Requirement: Seeding is performed via an explicit npm script
The project SHALL provide `npm run seed` and `npm run seed:clear` scripts in `server/package.json`. These scripts SHALL compile TypeScript and execute `dist/seed.js`. The server startup path (`connectDB`) SHALL NOT perform any seeding or data deletion.

#### Scenario: Server starts without touching data
- **WHEN** a developer runs `npm run dev` with a valid `MONGODB_URI`
- **THEN** the server connects to MongoDB and logs `MongoDB connected...` without deleting or inserting any meeting documents

#### Scenario: Seed script is invokable via npm
- **WHEN** a developer runs `SEED_DB=true npm run seed` in the `server/` directory
- **THEN** the process compiles TypeScript, connects to MongoDB, inserts 100 dummy meetings, and exits with code 0

#### Scenario: Clear-and-reseed is invokable via npm
- **WHEN** a developer runs `SEED_DB=true npm run seed:clear` in the `server/` directory
- **THEN** the process deletes all existing meeting documents, inserts 100 dummy meetings, and exits with code 0

### Requirement: Seeding requires explicit opt-in via SEED_DB=true
The seed script SHALL refuse to run unless `SEED_DB=true` is set in the environment. This prevents accidental seeding when the script is invoked without intent.

#### Scenario: Seed blocked without SEED_DB flag
- **WHEN** a developer runs `npm run seed` without setting `SEED_DB=true`
- **THEN** the process logs `ERROR: Seeding is disabled by default. Set SEED_DB=true to seed.` and exits with code 1

#### Scenario: Seed proceeds with SEED_DB=true
- **WHEN** a developer runs `SEED_DB=true npm run seed`
- **THEN** the seed script proceeds past the opt-in guard

### Requirement: Seeding is blocked in production
The seed script SHALL refuse to run when `NODE_ENV=production`, regardless of other environment variables including `SEED_DB`.

#### Scenario: Production guard blocks seeding
- **WHEN** `NODE_ENV=production` and `SEED_DB=true` and `npm run seed` is executed
- **THEN** the process logs `ERROR: Seeding is not allowed when NODE_ENV=production.` and exits with code 1

#### Scenario: Seeding proceeds in development
- **WHEN** `NODE_ENV=development` (or `NODE_ENV` is unset) and `SEED_DB=true`
- **THEN** the seed script proceeds past the production guard

### Requirement: Seeding is idempotent by default
If meeting documents already exist in the database and `--clear` is not passed, the seed script SHALL skip insertion and exit cleanly.

#### Scenario: Skip when data exists
- **WHEN** the database already contains one or more meeting documents and `npm run seed` is run without `--clear`
- **THEN** the process logs `Database already has N meetings. Use --clear to wipe and reseed.` and exits with code 0 without inserting any new documents

#### Scenario: Force reseed with --clear
- **WHEN** the database already contains meeting documents and `npm run seed:clear` is run
- **THEN** the process deletes all existing meetings, inserts 100 new dummy meetings, and exits with code 0

### Requirement: MONGODB_URI must be set for seeding to proceed
The seed script SHALL throw an error at module load time if `MONGODB_URI` is not set in the environment.

#### Scenario: Missing MONGODB_URI in seed script
- **WHEN** `MONGODB_URI` is not set and the seed script is executed
- **THEN** the process throws `MONGODB_URI environment variable is not set. Copy .env.example to .env and fill in your MongoDB connection string.` and exits with a non-zero code
