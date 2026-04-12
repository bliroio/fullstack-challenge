## Why

The `CreateMeetingDrawer` component wraps its content in a `LocalizationProvider` from `@mui/x-date-pickers`, but FE-000 already established a single app-level `LocalizationProvider` in `providers.tsx` that covers the entire component tree. The nested provider is redundant — it adds unnecessary imports and a superfluous React context layer with no functional benefit.

## What Changes

- Remove `import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"` from `CreateMeetingDrawer.tsx`
- Remove `import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"` from `CreateMeetingDrawer.tsx`
- Remove the `<LocalizationProvider dateAdapter={AdapterDateFns}>` wrapper element; `<Drawer>` becomes the top-level returned element

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This is a pure implementation cleanup — no spec-level requirements change. The `DateTimePicker` fields inside the drawer continue to function identically because they inherit the provider from `providers.tsx` via React context.

## Impact

- **File changed**: `client/app/components/create-meeting/components/CreateMeetingDrawer.tsx`
- **No API changes**, no new dependencies, no breaking changes
- Marginally reduces the client bundle (two fewer re-exports from `@mui/x-date-pickers`)
- TypeScript compilation must remain error-free after the change
