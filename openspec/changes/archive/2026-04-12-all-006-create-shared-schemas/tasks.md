## 1. Install Dependencies

- [x] 1.1 Install zod in shared package

## 2. Create Shared Schema Package

- [x] 2.1 Create directory `shared/schemas/` at the project root (sibling to `server/` and `client/`)
- [x] 2.2 Create `shared/schemas/meeting.ts` with `meetingSchema`, `createMeetingSchema`, and `listQuerySchema` Zod schemas and their inferred TypeScript types

## 3. Create Tests (TDD Red Phase)

- [x] 3.1 Create directory `shared/schemas/__tests__/`
- [x] 3.2 Create `shared/schemas/__tests__/meeting.test.ts` with property-based tests using fast-check

## 4. Configure npm Workspaces

- [ ] 4.1 Create root `package.json` with `"workspaces": ["client", "server", "shared"]`
- [ ] 4.2 Create `shared/package.json` with `name: "shared"`, `main: "dist/index.js"`, `types: "dist/index.d.ts"`, and build script
- [ ] 4.3 Update `shared/tsconfig.json` to emit JS + declarations to `shared/dist/` (remove `noEmit`, add `outDir`, `declaration`, `declarationMap`)
- [ ] 4.4 Create `shared/src/index.ts` barrel export that re-exports everything from `schemas/meeting`

## 5. Configure Server

- [ ] 5.1 In `server/tsconfig.json`, remove `"../shared/**/*"` from `include` array
- [ ] 5.2 In `server/tsconfig.json`, remove `"zod"` path workaround from `paths`
- [ ] 5.3 In `server/package.json`, add `"shared": "*"` to `dependencies`
- [ ] 5.4 Confirm server npm scripts use `dist/server.js` (not nested path)

## 6. Configure Client

- [ ] 6.1 In `client/tsconfig.json`, remove `@shared/*` path alias from `paths`
- [ ] 6.2 In `client/tsconfig.json`, remove `"zod"` path workaround from `paths`
- [ ] 6.3 In `client/tsconfig.json`, remove `"../shared/**/*.ts"` from `include` array
- [ ] 6.4 In `client/package.json`, add `"shared": "*"` to `dependencies`

## 7. Verify

- [ ] 7.1 Run `npm install` at root — expect workspaces linked
- [ ] 7.2 Run `npm run build -w shared` — expect JS + declarations in `shared/dist/`
- [ ] 7.3 Run `cd server && npm run build` — expect zero TypeScript errors and `dist/server.js` (flat, not nested)
- [ ] 7.4 Run `cd client && npm run build` — expect zero TypeScript errors
- [ ] 7.5 Run shared schema tests — expect all tests to pass
