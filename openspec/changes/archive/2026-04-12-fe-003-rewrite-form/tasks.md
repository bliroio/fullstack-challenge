## 1. TDD — Write Tests First (Red Phase)

- [x] 1.1 Create test directory `client/app/components/create-meeting/components/__tests__/`
- [x] 1.2 Write `CreateMeetingForm.test.tsx` with all 5 test cases (renders/defaults, title validation, submit disabled, valid submit calls onSubmit with Dates, double-click prevention, cancel resets + closes)

## 2. Delete Old Hook

- [x] 2.1 Delete `client/app/components/create-meeting/hooks/useCreateMeetingForm.ts`
- [x] 2.2 Remove the now-empty `client/app/components/create-meeting/hooks/` directory

## 3. Rewrite CreateMeetingForm

- [x] 3.1 Overwrite `client/app/components/create-meeting/components/CreateMeetingForm.tsx` with react-hook-form + zodResolver implementation using the form-local `createMeetingFormSchema` (z.date() for startTime/endTime, refine for end > start)
- [x] 3.2 Verify `useForm` is configured with `mode: "onChange"`, `defaultValues: { title: "", startTime: new Date(), endTime: addHours(new Date(), 1) }`, and `resolver: zodResolver(createMeetingFormSchema)`
- [x] 3.3 Verify `Controller` wraps all three fields (title TextField, startTime DateTimePicker, endTime DateTimePicker)
- [x] 3.4 Verify Save button is `disabled={!isValid || isSubmitting}` and shows "Saving..." while submitting
- [x] 3.5 Verify Cancel button calls `reset()` then `onClose()`
- [x] 3.6 Verify `errors.root` Alert renders above the form fields when set

## 4. Verify

- [x] 4.1 Run `cd client && npx vitest run` — all 5 tests pass (green phase)
- [x] 4.2 Run `cd client && npx tsc --noEmit` — zero TypeScript errors
- [x] 4.3 Confirm no file imports `useCreateMeetingForm` (grep returns zero results)
