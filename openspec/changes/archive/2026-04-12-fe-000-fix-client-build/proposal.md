## Why

The root layout uses `"use client"` which prevents `next build` from completing — a Server Component must own `<html>` and `<body>`. Additionally the MUI theme has three palette defects (identical light/dark/main, duplicate TextField override, missing DateTimePicker height exemption) that produce visual regressions.

## What Changes

- Remove `"use client"` from `client/app/layout.tsx`; make it a true Server Component
- Extract Emotion SSR cache into a new `ThemeRegistry` client component (prevents FOUC)
- Extract all client-side providers into a new `Providers` component
- Move `createTheme()` config into a standalone `theme.ts` module (importable in tests)
- Fix `primary.light` (`#F5945B`) and `primary.dark` (`#C84A1A`) — both were `#F26835` (same as main)
- Remove duplicate `MuiTextField` styleOverrides that shadowed `MuiOutlinedInput`
- Exempt `MuiInputBase-adornedEnd` inputs from the 40px height cap so DateTimePicker fields render at natural height
- Clean up `client/tsconfig.json` for npm workspaces: remove `@shared/*` path alias, `zod` path override, and `../shared/**` source includes — shared package resolves via `node_modules/shared` symlink

## Capabilities

### New Capabilities

- `client-layout`: Server Component root layout with Emotion SSR cache and client provider tree for MUI App Router integration

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- **Files created**: `client/app/theme.ts`, `client/app/ThemeRegistry.tsx`, `client/app/providers.tsx`
- **Files modified**: `client/app/layout.tsx`, `client/tsconfig.json`
- **New dependency**: `@emotion/cache` added as explicit dep in `client/package.json` (already present as transitive dep of `@emotion/react`)
- **Build**: `next build` will pass after this change; previously failed due to `"use client"` on root layout
- **No API surface changes**
