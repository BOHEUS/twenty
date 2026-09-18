# Lusha

Enrich People and Companies in Twenty with Lusha contact and company data.

## Features

- Select People or Companies in a table and run **Enrich with Lusha** from the
  command menu, or enrich records from a workflow step or the AI chat.
- People are matched on their email, LinkedIn profile, or full name plus
  company. Companies are matched on their domain. A matched record keeps its
  Lusha ID, which later runs look it up by.
- Standard fields are only filled when they are empty, and new emails and phone
  numbers are added next to the existing ones.
- A person without a company is linked to the company matching the domain
  Lusha returns, which is created if the workspace has none.
- What the standard objects have no field for is kept in Lusha fields:
  seniority, departments, location, do-not-call flag, industry, employee count,
  revenue range, funding, technologies, headquarters and the raw Lusha response.
- An **Enriched with Lusha** view on People and Companies lists the records
  Lusha enriched, most recent first.

## Configuration

The app calls the Lusha API V3 with your own Lusha API key and spends the
credits of that Lusha account. In **Settings > Apps > Lusha > Settings**, a
workspace admin fills in:

- **Lusha API key**: generated in the Lusha dashboard under Enrich > API. The
  Lusha account needs API V3 access.
- **Reveal phone numbers**: off by default, because phone numbers cost more
  credits than emails. Workflows and the AI chat can override it for a run.

A server admin can also set a `LUSHA_DEFAULT_API_KEY` on the Lusha application
registration of the instance. Workspaces that leave the app setting empty
enrich with that key, and a key filled in by a workspace always wins over it.

Each run reports every record as enriched, not found, skipped (nothing Lusha
can match on) or failed, how many Lusha credits it spent, and writes the
outcome to the **Lusha Status** field.

## Billing

Enriching with the instance-wide Lusha API key spends Twenty credits, priced on
the Lusha credits each run is billed for. A workspace that fills in its own
Lusha API key spends its own Lusha credits instead and is not charged.

## Getting started

Setup instructions live in [SETUP.md](SETUP.md).

## Changelog

Notable changes are documented in [CHANGELOG.md](CHANGELOG.md).

## Learn more

- [Lusha API documentation](https://docs.lusha.com/apis/openapi)
- [Twenty Apps documentation](https://docs.twenty.com/developers/extend/apps/getting-started/quick-start)
- [twenty-sdk CLI reference](https://www.npmjs.com/package/twenty-sdk)
