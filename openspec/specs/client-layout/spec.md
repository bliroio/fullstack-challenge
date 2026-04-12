## Purpose

Defines the requirements for the Next.js App Router root layout, MUI theme configuration, Emotion SSR integration, and TypeScript project configuration for the client workspace.

## Requirements

### Requirement: Root layout is a Server Component
The root `app/layout.tsx` SHALL NOT carry a `"use client"` directive so that Next.js can render `<html>` and `<body>` on the server and `next build` completes successfully.

#### Scenario: Build succeeds without "use client" on layout
- **WHEN** `npm run build` is executed in the `client/` directory
- **THEN** the build exits with code 0 and reports no errors related to root layout

### Requirement: Emotion styles are injected server-side
The application SHALL use an Emotion SSR cache (`ThemeRegistry`) so that MUI component styles are present in the initial HTML response and no flash-of-unstyled-content occurs.

#### Scenario: Hard refresh renders styled content
- **WHEN** a user hard-refreshes the page
- **THEN** MUI components are visually styled before any client-side JavaScript executes

### Requirement: Client providers are composed in a dedicated Providers component
All client-side providers (ThemeProvider via ThemeRegistry, LocalizationProvider, CssBaseline) SHALL be composed in `app/providers.tsx` so that the root layout remains a Server Component and the client boundary is explicit.

#### Scenario: Providers component wraps application children
- **WHEN** the root layout renders
- **THEN** all children are wrapped by ThemeRegistry, LocalizationProvider, and CssBaseline in a single client boundary

### Requirement: MUI theme is defined in a standalone module
The `createTheme()` call SHALL live in `app/theme.ts` with no React imports so that it can be imported in unit tests and Storybook without a React tree.

#### Scenario: Theme module importable outside React context
- **WHEN** `theme.ts` is imported in a test file without a React root
- **THEN** it exports a valid MUI theme object without throwing

### Requirement: Primary palette shades are differentiated
The theme SHALL define distinct values for `primary.light` (`#F5945B`) and `primary.dark` (`#C84A1A`) so that hover and active states on primary-colored elements are visually distinguishable from the base `primary.main` (`#F26835`).

#### Scenario: Hover state on primary button uses light shade
- **WHEN** a user hovers over a primary-colored button
- **THEN** the button background shifts to a visually distinct lighter orange shade

### Requirement: MuiTextField duplicate override is removed
The `MuiTextField` styleOverrides block SHALL be removed from the theme. The 40px height constraint SHALL be applied only via `MuiOutlinedInput.root`.

#### Scenario: Single source of height override
- **WHEN** the theme is inspected
- **THEN** only `MuiOutlinedInput` carries the 40px height override; no `MuiTextField` block exists

### Requirement: DateTimePicker inputs are exempt from 40px height cap
Inputs with an end adornment (class `MuiInputBase-adornedEnd`) SHALL have `height: auto` so that DateTimePicker fields render at their natural height rather than being clipped to 40px.

#### Scenario: DateTimePicker input taller than 40px
- **WHEN** the Create Meeting drawer is open and DateTimePicker fields are rendered
- **THEN** the DateTimePicker input fields are visibly taller than 40px

#### Scenario: Standard text input remains 40px
- **WHEN** the search bar in the header is rendered
- **THEN** the search input height is exactly 40px

### Requirement: tsconfig.json uses npm workspaces for shared package resolution
The `client/tsconfig.json` SHALL NOT contain path aliases or source includes that reach into the `../shared/` directory. The `shared` package SHALL resolve through the npm workspaces symlink at `node_modules/shared` using the package's `types` field.

#### Scenario: No cross-workspace source includes in tsconfig
- **WHEN** `client/tsconfig.json` is inspected
- **THEN** `paths` does not contain `@shared/*` or `zod` overrides, and `include` does not reference `../shared/**`

#### Scenario: Shared package imports resolve via workspace symlink
- **WHEN** a client module imports from `shared`
- **THEN** TypeScript resolves the types from `node_modules/shared/dist/index.d.ts`
