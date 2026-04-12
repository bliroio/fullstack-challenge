## ADDED Requirements

### Requirement: Server restricts CORS to configured frontend origin
The server SHALL only set the `Access-Control-Allow-Origin` response header when the request `Origin` matches the value of the `FRONTEND_URL` environment variable (defaulting to `http://localhost:3001`). Requests from any other origin SHALL NOT receive the `Access-Control-Allow-Origin` header.

#### Scenario: Preflight from allowed origin receives CORS header
- **WHEN** an OPTIONS request arrives with `Origin: http://localhost:3001` and `Access-Control-Request-Method: GET`
- **THEN** the response SHALL include `Access-Control-Allow-Origin: http://localhost:3001`

#### Scenario: Preflight from disallowed origin does not receive CORS header
- **WHEN** an OPTIONS request arrives with `Origin: http://evil-site.com` and `Access-Control-Request-Method: GET`
- **THEN** the response SHALL NOT include an `Access-Control-Allow-Origin` header

#### Scenario: Custom origin via environment variable
- **WHEN** `FRONTEND_URL` is set to `http://myapp.example.com` and an OPTIONS request arrives with `Origin: http://myapp.example.com`
- **THEN** the response SHALL include `Access-Control-Allow-Origin: http://myapp.example.com`
