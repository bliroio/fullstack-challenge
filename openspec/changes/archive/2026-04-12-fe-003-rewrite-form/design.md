## Context

`CreateMeetingForm` is the sole UI entry point for creating meetings. It currently delegates all state management to `useCreateMeetingForm`, a hand-rolled hook with three `useState` calls (formData, errors, isSubmitting). This hook has four confirmed bugs: no double-submit guard, no field-level error messages (only a generic "Failed to create meeting" alert), a non-null assertion crash risk (`formData.startTime!`), and `startTime === endTime` on mount which permanently disables the submit button with no explanation.

The project already has `react-hook-form` ^7, `@hookform/resolvers` ^5, `zod` ^4, and `date-fns` installed (FE-002). The shared `Meeting` type from `@shared/schemas/meeting` (ALL-006) defines `startTime` and `endTime` as `Date`. `TestProviders` wrapping `ThemeProvider` + `LocalizationProvider` is available for component tests (ALL-004).

## Goals / Non-Goals

**Goals:**
- Replace `useCreateMeetingForm` with `useForm` + `zodResolver` inside `CreateMeetingForm.tsx`
- Delete `useCreateMeetingForm.ts` (and its empty `hooks/` directory)
- Fix all four known bugs: double-submit, no field errors, non-null crash, equal default times
- Write TDD tests (red before implementation, green after)
- Preserve all existing styling (border radius, colors, spacing, button labels)
- Keep prop contract unchanged: `onSubmit: (meeting: Omit<Meeting, "id">) => Promise<void>`, `onClose: () => void`

**Non-Goals:**
- Changing any parent component (CreateMeetingDrawer, Header, page.tsx)
- Modifying the shared schema or backend
- Adding new form fields or changing the data shape sent to `onSubmit`
- Internationalizing error messages

## Decisions

### Decision 1: Form-local Zod schema using `z.date()` (not `z.coerce.date()`)

`DateTimePicker` with `AdapterDateFns` passes native `Date` objects to `onChange`. The form-local schema must accept `z.date()` (not `z.coerce.date()`) to avoid double-coercion surprises and type mismatches. The shared `createMeetingSchema` uses `z.coerce.date()` (for API input parsing), but the form schema is a UI concern living only in `CreateMeetingForm.tsx`.

**Alternative considered:** Reuse `createMeetingSchema` from shared. Rejected because that schema uses `z.coerce.date()` and targets API string inputs, not in-browser `Date` objects. Using it would require wrapping values or accepting loose typing.

### Decision 2: `mode: "onChange"` for `useForm`

Enables real-time validation so `formState.isValid` stays current as the user types or changes pickers. This drives the Save button's disabled state without extra computed booleans.

**Alternative considered:** `mode: "onBlur"`. Rejected because it would leave the Save button enabled after the user clears the title and moves focus, which is confusing.

### Decision 3: `Controller` for all fields (including TextField)

Using `Controller` for the title `TextField` (instead of `register`) is consistent with the two `DateTimePicker` fields (which require `Controller` because they don't emit standard input events). Uniform pattern is easier to maintain.

### Decision 4: `defaultValues: { endTime: addHours(new Date(), 1) }`

Fixes the bug where `startTime === endTime` makes the refine always fail on mount. `addHours` from `date-fns` (already installed) gives a clean 1-hour window. Native `Date` objects clone correctly inside `useForm`; Moment/Luxon/Dayjs do not.

### Decision 5: `errors.root` for API errors

react-hook-form's `setError("root", ...)` / `errors.root` is the canonical location for non-field errors (e.g., network failures). Replaces the `errors.general` key from the old hook. The `handleSubmit` wrapper does not call `setError("root")` by default — if `onSubmit` throws, the error propagates to the caller (the drawer handles it). The Alert renders only when `errors.root` is set.

## Risks / Trade-offs

- [Risk] `DateTimePicker` `inputRef` wiring may cause a React ref warning in tests → Mitigation: use `inputRef={field.ref}` per MUI X v8 docs; if test environment warns, suppress via `slotProps` override in test setup (not needed in production)
- [Risk] `mode: "onChange"` triggers validation on every keystroke → negligible performance impact for a small 3-field form
- [Risk] Deleting the hooks directory removes the only file in it; `rmdir` succeeds cleanly → no orphaned imports (confirmed by grep)

## Migration Plan

1. Write test file (red phase) — tests will fail until Step 2
2. Delete `useCreateMeetingForm.ts` and `hooks/` directory
3. Overwrite `CreateMeetingForm.tsx` with react-hook-form implementation
4. Run `npx vitest run` — all tests should pass (green phase)
5. Run `npx tsc --noEmit` in `client/` — zero type errors
6. No server changes, no database changes, no rollback needed (git revert covers it)

## Open Questions

None. All pre-solved in the plan file (DateTimePicker wiring, defaultValues cloning, z.date() vs z.coerce.date()).
