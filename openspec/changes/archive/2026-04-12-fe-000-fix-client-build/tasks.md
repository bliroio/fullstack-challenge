## 1. Add Explicit Dependency

- [x] 1.1 Run `npm install @emotion/cache` in `client/` to add it as an explicit dependency

## 2. Create Theme Module

- [x] 2.1 Create `client/app/theme.ts` with `createTheme()` config: differentiated `primary.light` (#F5945B) and `primary.dark` (#C84A1A), no `MuiTextField` override, `MuiOutlinedInput` height 40px with `MuiInputBase-adornedEnd` exemption

## 3. Create ThemeRegistry Component

- [x] 3.1 Create `client/app/ThemeRegistry.tsx` as a `"use client"` component implementing the Emotion SSR cache pattern with `useServerInsertedHTML`

## 4. Create Providers Component

- [x] 4.1 Create `client/app/providers.tsx` as a `"use client"` component composing `ThemeRegistry`, `LocalizationProvider`, and `CssBaseline`

## 5. Refactor Root Layout

- [x] 5.1 Rewrite `client/app/layout.tsx`: remove `"use client"`, remove all MUI/theme imports, wrap children with `<Providers>`

## 6. Clean Up tsconfig.json for Workspaces

- [x] 6.1 Remove `@shared/*` path alias from `compilerOptions.paths`
- [x] 6.2 Remove `zod` path override from `compilerOptions.paths`
- [x] 6.3 Remove `../shared/**/*.ts` from `include` array
- [x] 6.4 Remove `../shared/**/__tests__/**/*` from `exclude` array

## 7. Verification

- [x] 7.1 Run `cd client && npm run build` — verify it exits with code 0
- [x] 7.2 Run `cd client && npx tsc --noEmit` — verify zero type errors
