## Context

The Next.js 15 App Router requires that the root `layout.tsx` be a Server Component — it is the only component allowed to render `<html>` and `<body>`. The current `layout.tsx` carries `"use client"` (required by the MUI `ThemeProvider` and `LocalizationProvider`) which causes `next build` to fail. MUI's official recommendation for Next.js App Router is to inject Emotion's style cache server-side via `useServerInsertedHTML` inside a client wrapper component (`ThemeRegistry`), then compose all client providers in a separate leaf component.

Additionally, the existing theme in `layout.tsx` has three defects:
1. `primary.light` and `primary.dark` both equal `primary.main` (#F26835), breaking hover/active states.
2. `MuiTextField` styleOverrides duplicate the `MuiOutlinedInput` height rule — the TextField rule takes precedence and the conflict is confusing.
3. The 40px height cap on `MuiOutlinedInput` also constrains DateTimePicker fields (which have an adornment end icon), making them too short.

## Goals / Non-Goals

**Goals:**
- `next build` exits with code 0
- Zero flash-of-unstyled-content on hard refresh (Emotion SSR cache)
- Correct `primary.light` / `primary.dark` shades used in hover/active states
- DateTimePicker inputs taller than 40px; search bar / standard text inputs remain 40px
- `tsc --noEmit` passes with zero errors
- `theme.ts` is importable in tests and stories without a React tree

**Non-Goals:**
- Changing any visual design beyond the three palette/override fixes
- Adding new providers (deferred to FE-007)
- Migrating from MUI v5 to v6

## Decisions

### D1: Split layout into Server Component + `Providers` client leaf

**Decision**: `layout.tsx` becomes a pure Server Component. A `Providers` client component wraps all client-side concerns.

**Rationale**: Next.js 15 requires the root layout to be a Server Component. Moving `"use client"` out of the root is the only correct fix. Composing all client providers in a single `Providers` leaf keeps the boundary explicit and easy to audit.

**Alternatives considered**:
- Keep `"use client"` on layout and use a separate server layout wrapper: Not possible — only one root layout exists per route segment.
- Use `next-themes` or another wrapper: Unnecessary dependency; the MUI official pattern is sufficient.

### D2: Emotion SSR cache via `ThemeRegistry`

**Decision**: Implement the `ThemeRegistry` pattern from MUI's official Next.js App Router example. It intercepts `cache.insert` to track inserted style names, then flushes them on the server via `useServerInsertedHTML`.

**Rationale**: Without server-side style injection, the first paint is unstyled. This is the only approach that works with Next.js streaming SSR without adding a custom `_document.tsx` (which does not exist in App Router).

**Alternatives considered**:
- `StyledEngineProvider` alone: Does not solve SSR — styles are still injected client-side only.
- `@mui/material-nextjs` package: Available in MUI v6 only; project is on MUI v5.

### D3: DateTimePicker height exemption via `MuiInputBase-adornedEnd`

**Decision**: Add `"&.MuiInputBase-adornedEnd": { height: "auto" }` inside the `MuiOutlinedInput` root override.

**Rationale**: DateTimePicker injects an end adornment (calendar icon). `MuiInputBase-adornedEnd` is the reliable class applied to any input with an end adornment. Setting `height: auto` on that selector exempts only adornment-end inputs from the 40px cap, leaving the search bar (no adornment) at exactly 40px.

**Alternatives considered**:
- Target `MuiDateTimePicker` component directly: MUI v5 does not expose a top-level `MuiDateTimePicker` component key that accepts `styleOverrides`.
- Increase global height to 48px and manually shrink search bar: Inverts the override logic; more fragile.

### D4: Remove `MuiTextField` duplicate override

**Decision**: Delete the `MuiTextField` block entirely.

**Rationale**: `MuiTextField` is a composition component that renders `MuiOutlinedInput` internally. Overriding the height on both creates specificity confusion and redundant CSS. The `MuiOutlinedInput` override alone is sufficient.

## Risks / Trade-offs

- [Risk] `@emotion/cache` is currently a transitive dep; making it explicit avoids version drift. → Mitigation: `npm install @emotion/cache` pins the version.
- [Risk] The `cache.insert` monkey-patch in `ThemeRegistry` is based on internal Emotion API. → Mitigation: This is MUI's own recommended pattern and is stable across Emotion 11.x.
- [Risk] `MuiInputBase-adornedEnd` class name could change in a future MUI major. → Mitigation: Acceptable for v5; revisit at MUI v6 migration.

### D5: Clean up tsconfig.json for npm workspaces

**Decision**: Remove `@shared/*` path alias, `zod` path override, and `../shared/**/*.ts` source includes from `client/tsconfig.json`. The `shared` package resolves via the npm workspaces symlink at `node_modules/shared`.

**Rationale**: With npm workspaces, `shared` is symlinked into `client/node_modules/shared` and TypeScript resolves it via the package's `types` field pointing to `dist/index.d.ts`. Path aliases reaching into sibling source directories bypass the package boundary and can cause duplicate type definitions, stale builds, and zod version conflicts. The `dev:client` script already runs `npm run build -w shared` first, ensuring `shared/dist/` exists.

**Alternatives considered**:
- Keep `@shared/*` alias and add `composite`/`references`: Adds complexity; the workspace symlink already works.
- Use TypeScript project references: Overkill for this setup; npm workspaces handles the dependency graph.

## Migration Plan

1. `npm install @emotion/cache` in `client/`
2. Create `client/app/theme.ts` (pure config, no React)
3. Create `client/app/ThemeRegistry.tsx` (Emotion SSR cache + ThemeProvider)
4. Create `client/app/providers.tsx` (composes ThemeRegistry + LocalizationProvider + CssBaseline)
5. Rewrite `client/app/layout.tsx` as Server Component using `<Providers>`
6. Clean up `client/tsconfig.json`: remove `@shared/*`, `zod` path overrides, and `../shared/**` includes
7. Run `npm run build` — verify zero errors
8. Run `npx tsc --noEmit` — verify zero type errors

**Rollback**: Revert `layout.tsx` to its previous content; delete the three new files; remove `@emotion/cache` from `package.json`.

## Open Questions

None — all decisions are resolved above.
