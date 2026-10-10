# Hunter: self-hosting setup

This guide is for Twenty **server admins**.

## Server variables

Set these on the application registration after installing (**Settings → Applications → Hunter → Application registration**, admin only):

| Server variable | Required | Purpose |
|---|---|---|
| `HUNTER_API_KEY` | Yes | Hunter API key, sent in the `X-API-KEY` header. |
| `HUNTER_CREDIT_COST_DOLLARS` | Yes | Dollar cost of one Hunter credit on your plan. Each Hunter credit a call uses is billed at this rate to workspace credits. |

If a variable is missing, Hunter rejects the key (HTTP 401), or the plan's usage limit is reached (HTTP 429), enrichment fails with *"Hunter enrichment is unavailable. Contact your workspace admin."*

## Workspace setting

**Find missing emails** (on by default) runs Hunter's Email Finder for people without an email. It costs one Hunter credit for each email found.

## How it uses the API

- People: `GET /v2/combined/find?email=`, `GET /v2/email-finder` (domain or company, first and last name, or linkedin_handle), and `GET /v2/people/find?linkedin_handle=`.
- Companies: `GET /v2/companies/find?domain=`.
- A 404 is recorded as **No Match**, and so is a 451, which Hunter returns when the person asked not to have their data processed.
- Hunter reports its rate limit as HTTP 403, so a 403 is retried. Requests are spaced 150ms apart to stay under 15 per second and 500 per minute. A run stops starting new records after 240 seconds, inside the 300 second function timeout.
- Credits are counted the way Hunter charges them: one per email found, and 0.2 per enrichment that returns its core data (email, full name and position for a person; name, category, location and size for a company). Twenty is billed the exact cost, with the number of billed calls as the quantity.
