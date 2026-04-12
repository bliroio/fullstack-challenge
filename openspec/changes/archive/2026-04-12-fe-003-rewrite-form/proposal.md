## Why

The `CreateMeetingForm` component uses a hand-rolled `useCreateMeetingForm` hook with three `useState` calls, manual validation, no field-level error messages, a double-submit bug, and a default `endTime` equal to `startTime` that permanently disables the submit button with no explanation. The shared Zod schema (ALL-006) and form library dependencies (FE-002) are now in place — this is the right moment to replace the hook with `react-hook-form` + `zodResolver`, eliminating all known bugs in a single targeted rewrite.

## What Changes

- **DELETE** `client/app/components/create-meeting/hooks/useCreateMeetingForm.ts` — no other file imports it
- **OVERWRITE** `client/app/components/create-meeting/components/CreateMeetingForm.tsx` — replace hook usage with `useForm` + `Controller` + a form-local Zod schema
- **ADD** `client/app/components/create-meeting/components/__tests__/CreateMeetingForm.test.tsx` — TDD tests (written first, run red, then green after implementation)
- Zero prop contract changes: `onSubmit: (meeting: Omit<Meeting, "id">) => Promise<void>` and `onClose: () => void` are unchanged
- No upstream component changes (CreateMeetingDrawer, Header, page.tsx untouched)

## Capabilities

### New Capabilities

- `meeting-form-validation`: Client-side form validation for CreateMeetingForm using react-hook-form + Zod, with field-level error messages, double-submit prevention, correct default values, and TDD test coverage

### Modified Capabilities

<!-- No existing spec-level requirements are changing — this is a pure implementation swap with bug fixes -->

## Impact

- **Files deleted**: `client/app/components/create-meeting/hooks/useCreateMeetingForm.ts`, hooks directory
- **Files modified**: `client/app/components/create-meeting/components/CreateMeetingForm.tsx`
- **Files added**: `client/app/components/create-meeting/components/__tests__/CreateMeetingForm.test.tsx`
- **Dependencies used**: `react-hook-form` ^7, `@hookform/resolvers` ^5, `zod` ^4, `date-fns` (all already installed by FE-002)
- **Shared schema**: `@shared/schemas/meeting` (Meeting type) used for prop typing — `Omit<Meeting, "id">` = `{ title: string, startTime: Date, endTime: Date }`
- **No API or backend changes**
- **No breaking prop changes** to any parent component
