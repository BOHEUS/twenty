# Apollo

Enrich People and Companies with Apollo data, and keep the fields Apollo returns
that the standard objects have no home for.

## Features

- Enrich a single Person or Company, from the AI assistant or a workflow step.
- Enrich several People or Companies at once: select records in a table and run
  **Enrich with Apollo**, or use the bulk step in a workflow. Records are sent to
  Apollo's bulk endpoints ten at a time, and each one comes back with its own
  status (enriched, not found, skipped, error).
- Re-enrich a Company automatically when its domain changes.
- Store what Apollo returns beyond the standard fields: industry, keywords,
  funding, headcount growth, technologies, seniority, employment history, and the
  raw payload.

## Configuration

Enrichment runs on an OAuth connection to Apollo, not on an API key. A server
admin fills in `APOLLO_CONNECTION_CLIENT_ID` and `APOLLO_CONNECTION_CLIENT_SECRET`
once, from an OAuth app registered with Apollo; each user then connects their
Apollo account from the app's settings tab.

A run started by a person uses that person's own connection. Workflows,
database events and agents have nobody behind them, so they need a connection
shared with the workspace. If Apollo rejects a token, the app reports it and the
connection shows as needing a reconnect.

Enrichment consumes Apollo credits; asking for personal emails on People
consumes extra ones.

## Getting started

Setup instructions live in [SETUP.md](SETUP.md).

## Publishing

The `Publish` workflow (`.github/workflows/publish.yml`) publishes the app to npm with provenance using [npm trusted publishing](https://docs.npmjs.com/trusted-publishers). To publish:

1. On npmjs.com register this repository as a trusted publisher of your package, pointing at the `publish.yml` workflow.
2. Bump the version in `package.json`, then push a version tag (e.g. `git tag v1.0.0 && git push --tags`) or run the workflow manually from the Actions tab.

Publishing with provenance is also how you prove ownership when claiming your app in a Twenty marketplace.

## Learn more

- [Twenty Apps documentation](https://docs.twenty.com/developers/extend/apps/getting-started/quick-start)
- [twenty-sdk CLI reference](https://www.npmjs.com/package/twenty-sdk)
- [Discord](https://discord.gg/cx5n4Jzs57)
