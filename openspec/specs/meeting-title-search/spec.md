## Purpose

Defines the requirements for searching meetings by title, including the client service layer, Header search UI with debounce, page-level re-fetching, and associated test coverage.

## Requirements

### Requirement: listMeetings accepts optional title filter
The `listMeetings` function in `meetingService.ts` SHALL accept an optional `params?: { title?: string }` argument and, when `params.title` is a non-empty string, SHALL append `&title=<encodeURIComponent(params.title)>` to the API request URL.

#### Scenario: Title param appended to URL
- **WHEN** `listMeetings({ title: "standup" })` is called
- **THEN** the HTTP request URL includes `&title=standup`

#### Scenario: No title param leaves URL unchanged
- **WHEN** `listMeetings()` is called without arguments
- **THEN** the HTTP request URL does NOT include a `title` query parameter

#### Scenario: Empty title string is treated as no filter
- **WHEN** `listMeetings({ title: "" })` is called
- **THEN** the HTTP request URL does NOT include a `title` query parameter

### Requirement: Header search input debounces onSearch callback
The `Header` component SHALL accept an `onSearch: (query: string) => void` prop. When the user types in the search TextField, the component SHALL call `onSearch` with the current input value after 300ms of inactivity, cancelling any pending call if another keystroke arrives before the timer expires.

#### Scenario: onSearch called after 300ms debounce
- **WHEN** a user types into the search field and 300ms elapses without further input
- **THEN** `onSearch` is called exactly once with the full typed value

#### Scenario: Rapid typing fires onSearch only once
- **WHEN** a user types several characters in quick succession (each keystroke within 300ms of the previous)
- **THEN** `onSearch` is not called until 300ms after the last keystroke

#### Scenario: onSearch not called before debounce timer fires
- **WHEN** a user begins typing in the search field
- **THEN** `onSearch` is NOT called synchronously on each keystroke

### Requirement: Meeting list re-fetches when search query changes
The home page (`page.tsx`) SHALL re-fetch the meeting list via `listMeetings` whenever the search query changes, passing `{ title: searchQuery }` when the query is non-empty and omitting the title param when the query is empty.

#### Scenario: Meetings filtered after search
- **WHEN** the user types a search term and the debounce fires
- **THEN** the meeting list updates to show only meetings whose title matches the query

#### Scenario: All meetings shown when search cleared
- **WHEN** the user clears the search field and the debounce fires
- **THEN** the meeting list shows all meetings without a title filter

### Requirement: Header component tests cover debounce behavior
A test file SHALL exist at `client/app/components/__tests__/header.test.tsx` with unit tests verifying that `onSearch` is not called immediately on keystrokes and IS called after the 300ms debounce elapses.

#### Scenario: Debounce test passes with fake timers
- **WHEN** `npx vitest run` is executed in the `client/` directory
- **THEN** all tests in `header.test.tsx` pass with no failures
