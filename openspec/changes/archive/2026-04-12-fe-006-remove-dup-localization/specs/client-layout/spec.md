## ADDED Requirements

### Requirement: CreateMeetingDrawer does not nest a redundant LocalizationProvider
`CreateMeetingDrawer` SHALL NOT import or render its own `LocalizationProvider` or `AdapterDateFns`. All date-picker components inside the drawer SHALL rely solely on the app-level `LocalizationProvider` defined in `providers.tsx`.

#### Scenario: CreateMeetingDrawer has no LocalizationProvider import
- **WHEN** `CreateMeetingDrawer.tsx` is inspected
- **THEN** neither `AdapterDateFns` nor `LocalizationProvider` appears in its import statements

#### Scenario: DateTimePicker fields render correctly inside the drawer
- **WHEN** the Create Meeting drawer is opened
- **THEN** the DateTimePicker fields render and are interactive, inheriting the provider from `providers.tsx`
