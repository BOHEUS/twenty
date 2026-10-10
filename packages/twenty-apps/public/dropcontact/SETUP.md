# Dropcontact: self-hosting setup

This guide is for Twenty **server admins**.

## Server variables

Set these on the application registration after installing (**Settings → Applications → Dropcontact → Application registration**, admin only):

| Server variable | Required | Purpose |
|---|---|---|
| `DROPCONTACT_API_KEY` | Yes | Dropcontact API key, sent in the `X-Access-Token` header. |
| `DROPCONTACT_CREDIT_COST_DOLLARS` | Yes | Dollar cost of one Dropcontact credit on your plan. Each contact Dropcontact charges a credit for is billed at this rate to workspace credits. |

If either is missing, or Dropcontact rejects the key (HTTP 401) or the account is out of quota (HTTP 403), enrichment fails with *"Dropcontact enrichment is unavailable. Contact your workspace admin."*

## Workspace setting

**French company registry data** (on by default) sends `siren=true`, which adds SIREN, SIRET, VAT, NAF code, registered address, turnover and net income for French companies.

## How it uses the API

- `POST https://api.dropcontact.com/v1/enrich/all` with up to 250 contacts, `language=en`, and the Twenty record id in `custom_fields` so results can be matched back.
- `GET https://api.dropcontact.com/v1/enrich/all/{request_id}` every 15 seconds until the batch is ready, for at most 210 seconds per run.
- A batch that isn't ready in time keeps its `request_id` on the person (`dropcontactRequestId`), and the next run collects it instead of resubmitting. If Dropcontact no longer has that batch, the contacts are submitted again.
- Dropcontact returns a contact unchanged when it finds nothing. Such contacts are recorded as **No Match**.
- `industry` and `employee_count` are only returned on Dropcontact's trial and Growth plans.
