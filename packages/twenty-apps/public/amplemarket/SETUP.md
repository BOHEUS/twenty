# Amplemarket: self-hosting setup

This guide is for Twenty **server admins**.

## Server variables

Set these on the application registration after installing (**Settings → Applications → Amplemarket → Application registration**, admin only):

| Server variable | Required | Purpose |
|---|---|---|
| `AMPLEMARKET_API_KEY` | Yes | API key from Amplemarket **Settings → API**, sent as `Authorization: Bearer`. |
| `AMPLEMARKET_EMAIL_CREDIT_COST_DOLLARS` | Yes | Dollar cost of one Amplemarket email credit on your plan. |
| `AMPLEMARKET_PHONE_CREDIT_COST_DOLLARS` | Yes | Dollar cost of one Amplemarket phone credit on your plan. |

If a variable is missing, Amplemarket rejects the key (HTTP 401), or the account is out of credits (HTTP 402), enrichment fails with *"Amplemarket enrichment is unavailable. Contact your workspace admin."*

## Workspace setting

**Contact details** (email by default) chooses what Amplemarket reveals for people who are missing it. An email reveal costs one email credit and a phone reveal one phone credit.

## How it uses the API

- People: `GET /people/find` with `email`, `linkedin_url`, or `name` plus `company_domain` (or `company_name`), and `reveal_email` / `reveal_phone_numbers` when a reveal is wanted.
- Companies: `GET /companies/find` with `domain` or `linkedin_url`.
- A 404 is recorded as **No Match**, and so is a 451, which Amplemarket returns when the person was removed for privacy reasons. A 408 means a reveal timed out on Amplemarket's side; that record is reported as an error to run again.
- Amplemarket allows 350 requests per minute on `/people/find` and 500 on other endpoints, so requests are spaced 200ms apart and a 429 is retried. A run stops starting new records after 240 seconds, inside the 300 second function timeout.
- Credits are counted the way Amplemarket charges them: 0.5 email credits per person found, 1 email credit per email revealed, 1 phone credit per phone number revealed. Amplemarket only charges a found person once per 24 hours and a reveal once, so repeated enrichment of the same people can be billed to Twenty more than Amplemarket charged.
