## 1. Remove Redundant LocalizationProvider from CreateMeetingDrawer

- [x] 1.1 Remove `import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"` from `client/app/components/create-meeting/components/CreateMeetingDrawer.tsx`
- [x] 1.2 Remove `import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"` from `client/app/components/create-meeting/components/CreateMeetingDrawer.tsx`
- [x] 1.3 Remove the `<LocalizationProvider dateAdapter={AdapterDateFns}>` wrapper element so that `<Drawer>` is the top-level returned element

## 2. Verification

- [x] 2.1 Run `cd client && npx tsc --noEmit` and confirm zero TypeScript errors
