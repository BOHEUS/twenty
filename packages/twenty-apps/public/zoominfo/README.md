# ZoomInfo

**Enrich any Person or Company with ZoomInfo's B2B contact and firmographic data.**

## What you get

- **Contacts** — direct dial and mobile, verified and alternate emails, job title, job function and department, management level, employment history, tech skills, education, and the EU / California / Canada flags you need before you reach out.
- **Companies** — revenue, employee count and range, industries, SIC and NAICS codes, corporate hierarchy, funding, competitors, headcount by department, and whether ZoomInfo still considers the company alive.
- **Run it anywhere** — from the command menu on a record selection, as a workflow step, or from AI chat.
- **Company linking** — when an enriched person has no company in Twenty, the app finds the matching company record or creates one from the ZoomInfo employer data.

## Setup

The app authenticates with the OAuth 2.0 client credentials flow against your own ZoomInfo account. Create an application under the Developer tab in ZoomInfo, grant it the `api:data:contact` and `api:data:company` scopes, then configure:

- **ZOOMINFO_CLIENT_ID** (required) — the OAuth application's client ID.
- **ZOOMINFO_CLIENT_SECRET** (required, secret) — the OAuth application's client secret.
- **ZOOMINFO_CONTACT_MIN_ACCURACY_SCORE** (optional) — an integer from 0 to 100. Contacts matched below this accuracy score are recorded as no-match instead of being written. The command menu item always uses it; workflow nodes use it only when their own minimum accuracy score input is empty. Unset, ZoomInfo applies no floor.

## Matching

People are matched on, in order: a previously stored ZoomInfo contact id, then email address and LinkedIn URL, then full name paired with an employer. A person with nothing but a name is skipped rather than matched, since a bare name matches too many records to be trusted.

Companies are matched on a previously stored ZoomInfo company id, then domain, then name.

## Statuses

Every attempt writes **Enrichment Status** (Matched / No Match / Error) and the raw ZoomInfo **Match Status**. The two differ where it matters: `OPT_OUT` means the contact has opted out and will never match, while `NON_MATCH_BY_CONTACT_ACCURACY_MIN` means a record was found but fell below your accuracy floor and would match if you lowered it.

## Credits and limits

Enrichment spends your own ZoomInfo credits, not Twenty credits. ZoomInfo charges one credit the first time a record is retrieved; re-enriching the same record is free for the next twelve months. No-match and skipped records are not charged.

Both enrich endpoints accept at most 25 records per request, so bulk runs are chunked accordingly. ZoomInfo also enforces per-second, per-hour and per-day rate limits that vary by package.

## Units

ZoomInfo reports company revenue in thousands of dollars — a $100M company comes back as `100000`. The app converts it before writing the standard Annual Revenue field. Funding amounts are written as whole dollars.
