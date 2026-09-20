# RocketReach

Enrich Twenty People and Companies with RocketReach contact and firmographic data.

## Features

- Enrich selected People from the command menu, or one at a time from a workflow or an agent tool.
- Enrich selected Companies the same way.
- Writes RocketReach data into Twenty's standard fields (name, emails, phones, job title, LinkedIn, domain, address, annual revenue) and into RocketReach-specific custom fields for everything with no standard home.
- Links each enriched Person to their employer, creating the Company when the workspace does not have it yet.
- Ships an "Enriched (RocketReach)" table view on both People and Companies.

## How it maps

Person lookups use `GET /api/v2/universal/person/lookup`, company lookups use
`GET /api/v2/universal/company/lookup`.

A Person is matched by, in order: a stored RocketReach profile id, then the
record's LinkedIn URL and primary email, then its name paired with its company
name. RocketReach only accepts a name together with an employer, so a person
with no email, no LinkedIn and no company is skipped rather than looked up.

A Company is matched by a stored RocketReach company id, then domain, then
LinkedIn URL, then name.

RocketReach returns one `name` string for a person, so it is split on the first
space into Twenty's first and last name. Phone numbers arrive in E.164 with an
ISO country code, and both are kept.

### Pending lookups

A person lookup can answer `status: "progress"` while RocketReach is still
searching. When that happens the app stores the profile id, writes whatever
partial data came back, and marks the record `PENDING`. It polls `check_status`
for a bounded time first (RocketReach does not list a credit cost for that
endpoint); anything still unfinished is picked up by the next enrichment run,
which looks the profile up by its stored id.

## Credits

RocketReach bills per reveal flag, per matched profile:

| Reveal | Credits | Default |
| --- | --- | --- |
| Professional email | 2 | always on |
| Detailed enrichment (job history, education, skills, links) | 1 | always on |
| Personal email | 3 | off |
| Phone numbers | 6 | off |
| Healthcare (NPI) enrichment | 1 | off |
| Company enrichment | 1 | always on |

A lookup with no reveal flag returns nothing, which is why professional email
and detailed enrichment are always requested.

## Configuration

Set these in Settings -> Apps after installing:

| Variable | Required | Purpose |
| --- | --- | --- |
| `ROCKETREACH_API_KEY` | yes | RocketReach API key |
| `ROCKETREACH_REVEAL_PERSONAL_EMAIL` | no | Reveal personal emails (3 credits). Defaults to false |
| `ROCKETREACH_REVEAL_PHONE` | no | Reveal phone numbers (6 credits). Defaults to false |
| `ROCKETREACH_REVEAL_HEALTHCARE_ENRICHMENT` | no | Reveal NPI data (1 credit). Defaults to false |
| `ROCKETREACH_LOOKUP_CONCURRENCY` | no | Parallel lookups, 1 to 10. Defaults to 4 |
| `ROCKETREACH_CREDIT_COST_DOLLARS` | no | Dollar cost of one RocketReach credit under your contract |

RocketReach allows 10 requests per second across all APIs, and as few as 15
person lookups per minute on the Essentials plan, so keep
`ROCKETREACH_LOOKUP_CONCURRENCY` low unless your plan allows more. The app
honours `Retry-After` on a 429 and retries.

RocketReach does not publish a dollar price per credit, so
`ROCKETREACH_CREDIT_COST_DOLLARS` has a placeholder default; set it from your
contract for accurate billing.

## Getting started

Setup instructions live in [SETUP.md](SETUP.md).

## Publishing

The `Publish` workflow (`.github/workflows/publish.yml`) publishes the app to npm with provenance using [npm trusted publishing](https://docs.npmjs.com/trusted-publishers). To publish:

1. On npmjs.com register this repository as a trusted publisher of your package, pointing at the `publish.yml` workflow.
2. Bump the version in `package.json`, then push a version tag (e.g. `git tag v1.0.0 && git push --tags`) or run the workflow manually from the Actions tab.

Publishing with provenance is also how you prove ownership when claiming your app in a Twenty marketplace.

## Changelog

Notable changes are documented in [CHANGELOG.md](CHANGELOG.md).

## Learn more

- [RocketReach API reference](https://docs.rocketreach.co/reference/rocketreach-api)
- [Twenty Apps documentation](https://docs.twenty.com/developers/extend/apps/getting-started/quick-start)
- [twenty-sdk CLI reference](https://www.npmjs.com/package/twenty-sdk)
- [Discord](https://discord.gg/cx5n4Jzs57)
