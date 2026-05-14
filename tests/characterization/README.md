# Characterization Tests

These tests document the **exact API contract** of the existing Spring Boot backend.
They serve as a safety net: run them against the new Node.js backend to verify
that every endpoint matches the original behaviour.

## Running

```bash
# Against the original Spring Boot backend (must be running on :8080)
BASE_URL=http://localhost:8080 npm test

# Against the new Node.js backend (must be running on :3001)
BASE_URL=http://localhost:3001 npm test

# CI (no live backend — tests skip gracefully)
npm test
```

## Endpoints Covered (19 total)

| Method   | Path                                                          | Module       |
|----------|---------------------------------------------------------------|--------------|
| POST     | /api/register                                                 | Auth         |
| GET      | /api/verifyEmail/{email}                                      | Auth         |
| GET      | /api/authenticator/{email}/{password}                         | Auth         |
| POST     | /api/subscribe                                                | Subscription |
| GET      | /api/subscribe/{email}                                        | Subscription |
| POST     | /api/payment/card                                             | Payment      |
| POST     | /api/payment/proceed                                          | Payment      |
| POST     | /api/profile/add                                              | Profiles     |
| PUT      | /api/profile/update/{email}/{profileName}                     | Profiles     |
| DELETE   | /api/profile/delete/{email}/{profileName}                     | Profiles     |
| GET      | /api/profile/validate/{email}/{profileName}                   | Profiles     |
| GET      | /api/profile/validate/{gameHandle}                            | Profiles     |
| GET      | /api/profiles/{email}                                         | Profiles     |
| POST     | /api/list/add                                                 | Watchlist    |
| GET      | /api/list/{email}/{profileName}                               | Watchlist    |
| DELETE   | /api/list/delete/{email}/{profileName}/{videoTitle}           | Watchlist    |
| DELETE   | /api/list/delete/profile/{email}/{profileName}                | Watchlist    |
| GET      | /api/list/check/{email}/{profileName}/{videoTitle}            | Watchlist    |
| GET      | /api/videoSuggestions/{suggestionCategory}                    | Videos       |

## Edge Cases

- `POST /api/register` with duplicate email → 4xx response
- `GET /api/authenticator` with wrong password → 4xx or falsy body
- `GET /api/videoSuggestions` with nonexistent category → 4xx or empty array

## Security Notes (documented anti-patterns in original API)

The following calls pass **credentials in URL path parameters** — a security
anti-pattern that the new Node.js backend corrects:

- `GET /api/authenticator/{email}/{password}` — password in URL, logged by
  every proxy and server access log.

These are documented here for traceability; the new API uses POST + JWT body.
