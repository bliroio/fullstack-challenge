## Context

`CreateMeetingDrawer.tsx` currently wraps its returned JSX in `<LocalizationProvider dateAdapter={AdapterDateFns}>`. This was added before FE-000 established a single app-level `LocalizationProvider` in `providers.tsx`. MUI's `LocalizationProvider` uses React context — inner providers shadow outer providers, but when both use the same adapter the inner one is functionally identical and serves no purpose.

The existing spec (`client-layout` — "Client providers are composed in a dedicated Providers component") already mandates that `LocalizationProvider` lives in `providers.tsx`. This change makes the implementation match that requirement.

## Goals / Non-Goals

**Goals:**
- Remove the redundant `LocalizationProvider` wrapper and its two associated imports from `CreateMeetingDrawer.tsx`
- Ensure `npx tsc --noEmit` reports zero errors after the removal
- Keep the `DateTimePicker` fields fully functional (they inherit context from `providers.tsx`)

**Non-Goals:**
- No changes to `providers.tsx` or any other file
- No dependency version bumps
- No changes to tests or other components

## Decisions

**Single-file edit only.** The entire change is three deletions inside one file: two import lines and one JSX wrapper element. No new abstraction is needed. The `Drawer` becomes the component's top-level return element.

**No spec changes.** The `client-layout` spec already captures the requirement that `LocalizationProvider` belongs exclusively in `providers.tsx`. No delta spec is required.

## Risks / Trade-offs

[Risk] `DateTimePicker` fields break if `providers.tsx` does not actually wrap the drawer at runtime.
→ Mitigation: `providers.tsx` was verified to wrap all children via `LocalizationProvider`; the drawer is rendered inside the Next.js page tree which passes through `providers.tsx`.

[Risk] TypeScript compilation errors if the removed imports were referenced elsewhere in the file.
→ Mitigation: Neither `AdapterDateFns` nor `LocalizationProvider` is used anywhere else in `CreateMeetingDrawer.tsx`; TSC check confirms zero errors.
