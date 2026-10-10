# Snov.io: self-hosting setup

This guide is for Twenty **server admins**.

## Server variables

Set these on the application registration after installing (**Settings → Applications → Snov.io → Application registration**, admin only):

| Server variable | Required | Purpose |
|---|---|---|
| `SNOV_CLIENT_ID` | Yes | API user ID from Snov.io account settings, used as `client_id`. |
| `SNOV_CLIENT_SECRET` | Yes | API secret from Snov.io account settings, used as `client_secret`. |
| `SNOV_CREDIT_COST_DOLLARS` | Yes | Dollar cost of one Snov.io credit on your plan. Each Snov.io credit a call uses is billed at this rate to workspace credits. |

If a variable is missing, or Snov.io rejects the credentials or reports the account is out of credits, enrichment fails with *"Snov.io enrichment is unavailable. Contact your workspace admin."*

## Workspace setting

**Find missing emails** (on by default) runs Snov.io's Email Finder for people without an email. It costs one Snov.io credit for each email found with a valid or unknown status.

## How it uses the API

- `POST /v1/oauth/access_token` with client credentials. The token lasts an hour and is reused. v2 calls send it as `Authorization: Bearer`, and v1 calls also pass it as the `access_token` parameter, as Snov.io documents.
- People: `POST /v1/get-profile-by-email`, `POST /v2/emails-by-domain-by-name/start` then `GET .../result`, and `POST /v2/li-profiles-by-urls/start` then `GET .../result`.
- Companies: `POST /v2/domain-search/start` then `GET /v2/domain-search/result/{task_hash}`.
- Requests are spaced one second apart to stay within Snov.io's limit of 60 requests per minute. A run stops starting new records after 240 seconds, inside the 300 second function timeout.
- Credits are counted the way Snov.io charges them: one per profile found by email, one per email with a valid or unknown status, one per LinkedIn profile returned, and one per domain search with results.
