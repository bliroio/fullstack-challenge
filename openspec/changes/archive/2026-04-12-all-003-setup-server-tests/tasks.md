## 1. Install Dev Dependencies

- [x] 1.1 Run `npm install -D vitest supertest @types/supertest fast-check` in `server/`

## 2. Split app.ts and Create server.ts

- [x] 2.1 Edit `server/src/app.ts`: remove `import connectDB from "./db"`, remove `import dotenv` and `dotenv.config()`, remove `const port = ...`, remove `connectDB()` call and its comment, remove `app.listen(...)` block, add `export default app` at the end
- [x] 2.2 Create `server/src/server.ts` as the new runtime entry point with `dotenv.config()`, `import app from "./app"`, `import connectDB from "./db"`, and `connectDB().then(() => app.listen(port, ...))`

## 3. Update package.json Scripts

- [x] 3.1 Change `start` script from `node dist/app.js` to `node dist/server.js`
- [x] 3.2 Change `dev` script from `tsc && node dist/app.js` to `tsc && node dist/server.js`
- [x] 3.3 Add `test` script: `vitest run --passWithNoTests`
- [x] 3.4 Add `test:watch` script: `vitest`

## 4. Create Vitest Config

- [x] 4.1 Create `server/vitest.config.ts` with `globals: true`, `environment: "node"`, and `include: ["src/**/*.test.ts"]`

## 5. Verify

- [x] 5.1 Run `npm run build` in `server/` — confirm zero TypeScript errors and both `dist/app.js` and `dist/server.js` exist
- [x] 5.2 Run `npm test` in `server/` — confirm vitest exits with code 0
