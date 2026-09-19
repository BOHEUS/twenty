# Crustdata

Enrich Twenty People and Companies with [Crustdata](https://crustdata.com).

## Setup

Set these in Settings -> Apps after installing:

| Variable | Required | What it does |
| --- | --- | --- |
| `CRUSTDATA_API_KEY` | Yes | Crustdata API key. |
| `CRUSTDATA_CONTACT_ENRICHMENT_ENABLED` | No | `true` also fetches emails and phone numbers. Off by default: it is a second billed call and Crustdata gates it to Enterprise plans. |
| `CRUSTDATA_CREDIT_COST_DOLLARS` | No | Dollar cost of one Crustdata credit on your contract, used to bill workspace credits. Defaults to `0.01`. |

## Usage

Select People or Companies and run **Enrich people with Crustdata** / **Enrich companies with Crustdata** from the command menu, or use the `Enrich People` / `Enrich Companies` workflow actions. Installing the app also seeds one workflow per object.

Each object gets an **Enriched (Crustdata)** table view showing what came back.

## What it calls

| Endpoint | Used for | Matches on |
| --- | --- | --- |
| `POST /person/enrich` | Person profile, role, education, skills, socials | Professional network (LinkedIn) profile URL only |
| `POST /person/contact/enrich` | Emails and phone numbers | Same profile URL, or a business email. Opt-in, billed separately |
| `POST /company/enrich` | Firmographics, headcount, funding, revenue, hiring, reviews | Domain, profile URL, Crustdata ID or name |

All requests send `x-api-version: 2025-11-01` and are capped at 25 identifiers per call.

## Things worth knowing

**People need a LinkedIn URL for a profile.** Crustdata's synchronous person enrich matches on a professional network profile URL and nothing else; resolving an email back to a profile is an asynchronous batch job on a different endpoint. A Person without a LinkedIn URL is reported as skipped, unless contact enrichment is on and they have a work email, in which case contact enrichment runs on that email and fills in emails and phone numbers only. A Person with neither is always skipped.

**Sections must be requested explicitly.** Person enrich returns only `basic_profile` and `social_handles` by default, and company enrich only `basic_info`. The app names every section it maps in `fields`.

**`redacted` is not `not found`.** When a person has asked Crustdata to remove their data, the response says so. That record gets its own status, because retrying will never match.

**Revenue is a range.** Crustdata estimates revenue as a lower and upper bound, and Twenty's `annualRevenue` holds one figure. The two bounds are kept in their own currency fields instead of collapsing them into a number that would read as exact.

**Company addresses have no city or postcode.** The headquarters comes back as one line, so it is written to the street field rather than split on a guess.

**Billed add-ons are left out.** `technographics` (+2 credits per company) and `social_posts` (+5 credits per profile) both need field-level access on the API key, so the app does not request them and creates no fields for them. `certifications`, `honors` and `assessment` also need field-level access but cost nothing extra, so they are requested and simply stay empty without the grant.

**Rate limits are retried, not failed.** Crustdata allows 15 requests a minute by default, and a bulk run issues several back to back. A `429` is retried up to twice, waiting the window named by `Retry-After` or `X-RateLimit-Reset`, so one throttled request does not fail a whole batch of records.

**Charges follow the `x-credits-used` header.** Every response reports what the call actually cost, so the workspace is billed on that rather than on a per-match estimate.

## Development

```bash
yarn install
yarn typecheck
yarn lint
yarn test:unit                 # unit tests
yarn test                      # integration tests, needs a running Twenty
```
