# Explorium: self-hosting setup

This guide is for Twenty **server admins**.

## Server variables

Set these on the application registration after installing (**Settings → Applications → Explorium → Application registration**, admin only):

| Server variable | Required | Purpose |
|---|---|---|
| `EXPLORIUM_API_KEY` | Yes | Explorium API key, sent in the `api_key` header. |
| `EXPLORIUM_CREDIT_COST_DOLLARS` | Yes | Dollar cost of one Explorium credit on your contract. Explorium doesn't publish a rate, so each call's reported credit usage is multiplied by this value to bill workspace credits. |

If the key or the credit cost is missing, or Explorium rejects the key or the account is out of credits, enrichment fails with *"Explorium enrichment is unavailable. Contact your workspace admin."*

## Contact details

Which contact details person enrichment fetches is a workspace setting, not a server variable. Workspace admins pick it under **Settings → Applications → Explorium → Contact details**: professional email, phone numbers, both, or neither. It defaults to professional email only. Explorium charges 2 credits per person for email alone and 5 for phones, alone or with email. With neither selected the contact call is skipped.

## API usage

The app uses Explorium's v2 API (`https://api.explorium.ai/v2`):

- People: `POST /prospects/match`, then `POST /prospects/profiles/enrich` and `POST /prospects/contact_information/enrich`.
- Companies: `POST /businesses/match`, then `POST /businesses/firmographics/enrich`.

Records are sent in batches of 50, the most each endpoint accepts. Explorium counts every record in a batch against its rate limit of 200 queries per minute, so a batch of 50 people uses up to 150 queries. The app waits and retries when Explorium answers with HTTP 429.
