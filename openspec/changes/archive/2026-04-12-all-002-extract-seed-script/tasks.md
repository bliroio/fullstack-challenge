## 1. Edit server/src/db.ts

- [x] 1.1 Remove `import { Meeting } from "./models/meeting";` from `db.ts`
- [x] 1.2 Replace `const dbUri = process.env.MONGODB_URI || "fallback_default_mongodb_uri";` with a top-level `throw` when `MONGODB_URI` is missing, then assign `const dbUri = process.env.MONGODB_URI;`
- [x] 1.3 Remove the `await resetDatabase();` call and the `console.log("Database reset completed...")` line from inside `connectDB()`
- [x] 1.4 Delete the entire `resetDatabase` function

## 2. Create server/src/seed.ts

- [x] 2.1 Create `server/src/seed.ts` with dotenv import and MONGODB_URI fail-fast throw at module load time
- [x] 2.2 Implement the `seed()` async function with the production guard (`NODE_ENV=production` → exit 1)
- [x] 2.3 Add the opt-in guard (`SEED_DB !== "true"` → exit 1) inside `seed()`
- [x] 2.4 Implement `--clear` flag detection and `Meeting.deleteMany({})` when flag is present
- [x] 2.5 Implement idempotency check: if `countDocuments() > 0` and no `--clear`, log and exit 0
- [x] 2.6 Implement the 100-meeting insertion loop and `Meeting.insertMany()`
- [x] 2.7 Add `mongoose.disconnect()` and `process.exit(0)` on success, with error handler calling `seed()`

## 3. Edit server/package.json

- [x] 3.1 Add `"seed": "tsc && node dist/seed.js"` script entry after the `"dev"` entry
- [x] 3.2 Add `"seed:clear": "tsc && node dist/seed.js --clear"` script entry after `"seed"`

## 4. Edit server/README.md

- [x] 4.1 Remove the line `**Note: It might take a few seconds until the database is reset :)**`
- [x] 4.2 Add a `## Seeding the Database` section documenting `SEED_DB=true npm run seed`, `SEED_DB=true npm run seed:clear`, and the production/opt-in guard notes

## 5. Verification

- [x] 5.1 Run `cd server && npm run build` — confirm zero TypeScript errors
- [x] 5.2 Confirm `server/src/db.ts` no longer imports `Meeting` and no longer calls `resetDatabase`
- [x] 5.3 Confirm `server/src/seed.ts` exists and contains both safety guards and the `--clear` flag logic
- [x] 5.4 Confirm `server/package.json` contains `seed` and `seed:clear` script entries
- [x] 5.5 Confirm `server/README.md` documents `npm run seed` and `npm run seed:clear` and no longer mentions "database is reset"
