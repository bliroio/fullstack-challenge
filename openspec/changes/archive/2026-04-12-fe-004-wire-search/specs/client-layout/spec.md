## MODIFIED Requirements

### Requirement: Header accepts onSearch prop
The `Header` component SHALL accept an `onSearch: (query: string) => void` prop as a required part of its public API. All call sites SHALL pass a handler that receives the debounced search query string.

#### Scenario: Header renders with onSearch prop
- **WHEN** `<Header onCreateMeeting={fn} onSearch={fn} />` is rendered
- **THEN** the component renders without TypeScript errors and the search field is present

#### Scenario: page.tsx passes onSearch to Header
- **WHEN** `page.tsx` renders the Header component
- **THEN** it passes a valid `onSearch` callback that updates the search query state
