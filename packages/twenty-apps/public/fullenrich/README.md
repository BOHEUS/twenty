# FullEnrich

Enriches Twenty People and Companies with [FullEnrich](https://fullenrich.com) contact and profile data.

## Features

- Select people, then run "Enrich with FullEnrich" from the command menu.
- Fills the person's work email, personal email and phone number, plus their profile: headline, about, location, skills, languages, education, seniority, job function and employment history.
- Fills the linked company: description, industry, headcount, headcount range, company type, specialties, founded year, headquarters address and office locations.
- Every field this app adds carries a `fullEnrich` prefix, so it never collides with a standard Twenty field or with another enrichment app's.
- All 26 fields are attached to the standard People and Companies index views, hidden by default: pick the ones you want from the view's field menu without the default table growing 26 columns.

## How it works

Running the command menu item does not wait for FullEnrich. The `enrich` route splits the selected records into batches of 100 (the API's per-request limit), enqueues one background job per batch, and answers immediately; each `enrich-batch` job then sends its own bulk request. A batch that is rate limited or hits an outage is redelivered by the job runner, so the 60 requests per minute limit needs no pacing in the app.

FullEnrich answers asynchronously and calls the app's webhook back when a batch finishes. The webhook is unauthenticated, so every payload's `X-Signature-SHA1` HMAC is verified against the API key before anything is written.

Results only reach records the request itself named, and the company is only updated when the employer FullEnrich reports still matches the company the person is linked to in Twenty.

## Settings

| Variable | Purpose |
| --- | --- |
| `FULLENRICH_API_KEY` | API key from the [FullEnrich dashboard](https://app.fullenrich.com/app/), for this workspace. Also verifies incoming webhook signatures. Falls back to `FULLENRICH_ADMIN_API_KEY` when left empty. |
| `FULLENRICH_DATA_REQUIREMENTS` | Which contact data to request: work emails, personal emails, phones. Each selection is billed separately. |
| `FULLENRICH_REQUEST_CONSTRAINTS` | Skip a record that already holds all of the selected data. Empty means always enrich. |

`FULLENRICH_ADMIN_API_KEY` is a server variable rather than a workspace one: set it once on the instance and every workspace that has not entered its own key uses it.

## Getting started

Setup instructions live in [SETUP.md](SETUP.md).

## Learn more

- [Twenty Apps documentation](https://docs.twenty.com/developers/extend/apps/getting-started/quick-start)
- [FullEnrich API reference](https://docs.fullenrich.com/api/v2/general/introduction)
- [Discord](https://discord.gg/cx5n4Jzs57)
