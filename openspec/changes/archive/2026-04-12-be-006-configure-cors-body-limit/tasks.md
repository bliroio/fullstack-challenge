## 1. Tests (TDD — write first, expect red)

- [x] 1.1 Create `server/src/__tests__/security.test.ts` with CORS and body-size-limit test cases using vitest and supertest

## 2. Implementation

- [x] 2.1 Edit `server/src/app.ts`: replace `app.use(cors())` with `app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3001" }))`
- [x] 2.2 Edit `server/src/app.ts`: replace `app.use(express.json())` with `app.use(express.json({ limit: "1mb" }))`

## 3. Verification

- [x] 3.1 Run `cd server && npm run build` and confirm no TypeScript errors
- [x] 3.2 Run `npx vitest run server/src/__tests__/security.test.ts` and confirm all tests pass
