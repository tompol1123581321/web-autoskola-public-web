# Public Web API Endpoints

Backend contract for the Autoškola Hlaváček public website.

## Overview

The public website needs the following backend capabilities:

1. Read the current price list.
2. Read active course terms available for registration.
3. Create a new course registration.

The current frontend already uses the price-list endpoint. The registration API currently contains empty `fetch("")` URLs, so the paths below are the recommended contract to implement and then configure in the frontend.

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

## 2. Get Active Course Terms

This endpoint supplies the options displayed in the registration form.

### Request

```http
GET /api/terms/active
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

- Enable CORS only for the production public-web origin and approved local development origins.
- Apply rate limiting to public registration endpoints.
- Add bot protection or a honeypot to public POST endpoints.
- Never trust `gdpr` or any validation performed in the browser.
- Do not expose database errors or stack traces to the client.
- Log registration failures with a request ID, not with unnecessary personal data.
- Consider an idempotency key to prevent duplicate registrations after retries.
- Use HTTPS in every environment that handles personal data.
- Store the registration timestamp on the server, not from the browser.

## Frontend Integration Checklist

Once the backend is available, update the frontend API wrapper:

```ts
const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

fetch(`${API_BASE_URL}/terms/active`);
fetch(`${API_BASE_URL}/registrations`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

Also replace the current empty URLs in:

```text
src/react-components/react-register-form/api/index.ts
```

Recommended backend smoke tests:

1. Load active terms and verify the response is a JSON array.
2. Submit a valid registration and expect `201`.
3. Submit without GDPR consent and expect `422`.
4. Submit an unavailable term and expect `409` or `422`.
5. Submit malformed email and phone data and expect field errors.
6. Submit the same idempotency key twice and verify no duplicate registration is created.
