## 1. Create Server Example File

- [x] 1.1 Create `server/.env.example` with entries for MONGODB_URI, PORT, NODE_ENV, FRONTEND_URL, and SEED_DB (commented out)

## 2. Create Client Example File

- [x] 2.1 Create `client/.env.local.example` with entry for NEXT_PUBLIC_API_URL

## 3. Verify

- [x] 3.1 Confirm `server/.env.example` exists and is not listed in any `.gitignore`
- [x] 3.2 Confirm `client/.env.local.example` exists and is not listed in any `.gitignore`
- [x] 3.3 Confirm every `process.env.*` reference in `server/src/` has a corresponding entry in `server/.env.example`
