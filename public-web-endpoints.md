# Public Web API Endpoints

Backend contract for the Autoškola Hlaváček public website.

## Overview

The public website needs the following backend capabilities:

1. Read the current price list.
2. Read active course terms available for registration.
3. Create a new course registration.

The frontend is implemented against this contract: `PUBLIC_API_BASE_URL` is used as the base for all three endpoints, and the registration form uses `/api/registrations/options` for available terms.

## Implementation Priority

Implement in this order:

1. `GET /api/registrations/options` so the registration form can offer selectable terms.
2. `POST /api/registrations` so users can submit the form.
3. `GET /api/webSettings/current` for the public price list.

The frontend currently disables registration when no active term is returned. An empty term array is a valid business response, but the website should show that registration is temporarily unavailable rather than accepting a registration without a term.

## Common API Rules

- All responses must be UTF-8 JSON with `Content-Type: application/json`.
- Dates must be ISO 8601 UTC strings, for example `2026-09-07T12:00:00.000Z`.
- IDs are strings at the public API boundary, including term IDs.
- Error messages returned to the public website must be safe for end users; never return SQL, stack traces, or internal service details.
- Add an `X-Request-Id` response header, or return a `requestId` field in error responses, so support can trace failed submissions.

## Base URL

Use one configurable public API base URL, for example:

```text
https://api.example.cz/api
```

The frontend should not hard-code environment-specific hosts. Recommended environment variable:

```text
PUBLIC_API_BASE_URL=https://api.example.cz/api
```

## 1. Get Current Price List

### Request

```http
GET /api/webSettings/current
Accept: application/json
```

Existing production URL currently used by the website:

```text
https://web-autoskola-server.deno.dev/api/webSettings/current
```

### Response: `200 OK`

```json
{
  "priceList": [
    {
      "label": "B",
      "value": "18 900 Kč"
    },
    {
      "label": "Kondiční jízdy skupina B – 1 hodina (45 min.)",
      "value": "600 Kč"
    }
  ],
  "termOptions": [
    {
      "id": "2026-10-b-01",
      "label": "Skupina B – říjen 2026"
    }
  ]
}
```

### Required contract

- `priceList` must always be an array.
- Each price item must contain non-empty string fields `label` and `value`.
- `termOptions` may be returned here for shared settings, but the dedicated terms endpoint below is preferred for registration availability.
- Response must use `Content-Type: application/json`.

### Error responses

```json
{
  "error": {
    "code": "WEB_SETTINGS_UNAVAILABLE",
    "message": "Web settings are temporarily unavailable."
  }
}
```

Recommended status codes: `500` for an internal error, `503` when the settings service is temporarily unavailable.

The frontend has a local fallback price list if this endpoint fails.

### Frontend mapping

The current frontend reads:

```ts
const priceListData = response.priceList;
```

The public price page expects each item to expose `label` and `value` as display strings. The initial contract should return the already formatted Czech value.

## 2. Get Available Registration Terms

This endpoint supplies the options displayed in the registration form.

### Request

```http
GET /api/registrations/options
Accept: application/json
```

### Response: `200 OK`

```json
[
  {
    "id": "2026-10-b-01",
    "label": "Skupina B – říjen 2026"
  },
  {
    "id": "2026-11-a-01",
    "label": "Skupina A – listopad 2026"
  }
]
```

### Required contract

Each option must match:

```ts
type TermOption = {
  id: string;
  label: string;
};
```

Only terms that are:

- active,
- open for registration,
- not full,
- and not in the past

should be returned.

When there are no available terms, return `200 OK` with an empty array:

```json
[]
```

Do not return HTML, `null`, or an object for this endpoint.

### Error response

```json
{
  "error": {
    "code": "TERMS_UNAVAILABLE",
    "message": "Course terms are temporarily unavailable."
  }
}
```

Recommended status codes: `500` or `503`.

### Empty and unavailable states

- `200 []`: the endpoint worked and there are currently no available terms. The frontend disables registration and shows "Termíny nejsou momentálně dostupné".
- `503` or a network error: the frontend shows a distinct "Zkusit znovu" (retry) control instead of treating it as a valid empty list.
- Never return `200` with an HTML error page or a different JSON shape.

## 3. Create Course Registration

This is the main public conversion endpoint used by the registration form.

### Request

```http
POST /api/registrations
Content-Type: application/json
Accept: application/json
```

### Request body

```json
{
  "firstName": "Jan",
  "lastName": "Novák",
  "phoneNumber": "603 928 674",
  "email": "jan.novak@example.com",
  "notes": "Preferuji odpolední termín.",
  "termId": "2026-10-b-01",
  "gdpr": true
}
```

### TypeScript shape

```ts
type CreateRegistrationRequest = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  notes: string;
  termId: string;
  gdpr: true;
};
```

The frontend currently removes whitespace from the phone number before validation. The backend should also normalize whitespace and accept common Czech formats, for example:

- `603 928 674`
- `603928674`
- `+420 603 928 674`

### Server-side validation

The backend must validate independently of the frontend:

- `firstName`: required, trimmed, reasonable length limit.
- `lastName`: required, trimmed, reasonable length limit.
- `email`: required and valid email format.
- `phoneNumber`: required and valid Czech phone format.
- `termId`: required and must refer to an active, available term.
- `gdpr`: must be exactly `true`.
- `notes`: optional, with a length limit and HTML stripped or escaped.

### Success response: `201 Created`

```json
{
  "result": {
    "id": 1234,
    "firstName": "Jan",
    "lastName": "Novák",
    "email": "jan.novak@example.com",
    "termId": "2026-10-b-01",
    "registrationDate": "2026-09-07T12:00:00.000Z"
  },
  "message": "Registrace byla úspěšně vytvořena."
}
```

The frontend only requires a truthy `result` and a response `message`.

### Registration transaction requirements

The registration write must be atomic:

1. Validate the request.
2. Confirm that `termId` exists, is active, and still has capacity.
3. Reserve one place for the registration.
4. Persist the registration and server-side `registrationDate` together.

Two simultaneous requests must not overbook the same term. The API should return `409` when capacity is lost between validation and persistence.

### Validation error: `422 Unprocessable Entity`

```json
{
  "result": null,
  "message": "Zkontrolujte zadané údaje.",
  "errors": {
    "email": "Zadejte platný email.",
    "termId": "Vybraný termín již není dostupný."
  }
}
```

### Other errors

```json
{
  "result": null,
  "message": "Registraci se nepodařilo uložit. Zkuste to prosím později.",
  "error": {
    "code": "REGISTRATION_UNAVAILABLE"
  }
}
```

Recommended status codes:

- `400` malformed JSON or invalid request shape
- `409` term became full or unavailable during submission
- `422` validation failed
- `429` rate limit exceeded
- `500` unexpected server error
- `503` registration service unavailable

## Security and Operations

- Enable CORS only for the production public-web origin and approved local development origins. Allow `GET`, `POST`, and the headers `Accept`, `Content-Type`, and `Idempotency-Key`.
- Apply rate limiting to public registration endpoints.
- Add bot protection or a honeypot to public POST endpoints.
- Never trust `gdpr` or any validation performed in the browser.
- Do not expose database errors or stack traces to the client.
- Log registration failures with a request ID, not with unnecessary personal data.
- Consider an idempotency key to prevent duplicate registrations after retries.
- Use HTTPS in every environment that handles personal data.
- Store the registration timestamp on the server, not from the browser.

Recommended CORS origins during development:

```text
http://localhost:4321
http://127.0.0.1:4322
```

Production should use the final deployed public-web origin only.

## Frontend Integration Checklist

This is implemented in the frontend API wrapper:

```ts
const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

fetch(`${API_BASE_URL}/api/registrations/options`, {
  headers: { Accept: "application/json" },
});
fetch(`${API_BASE_URL}/api/registrations`, {
  method: "POST",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Idempotency-Key": crypto.randomUUID(),
  },
  body: JSON.stringify(data),
});
```

See:

```text
src/react-components/react-register-form/api/index.ts
```

The frontend handles these states:

- `200` or `201`: show success message, reset the form.
- `409`: tell the user the selected term is no longer available and reload term options.
- `422`: show `message` and map `errors` onto individual form fields.
- `429`: show "Příliš mnoho pokusů. Zkuste to prosím později."
- `400`, `500`, `503`, or a network error: show a retry message and keep the entered form values.

Recommended backend smoke tests:

1. Load active terms and verify the response is a JSON array.
2. Submit a valid registration and expect `201`.
3. Submit without GDPR consent and expect `422`.
4. Submit an unavailable term and expect `409` or `422`.
5. Submit malformed email and phone data and expect field errors.
6. Submit the same idempotency key twice and verify no duplicate registration is created.
