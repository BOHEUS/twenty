# Setup

Follow these steps to get the app running locally.

## Prerequisites

- Node.js (version specified in `.nvmrc`)
- Yarn 4
- Docker (to run the local Twenty server)
- A RocketReach API key with Universal Credit access

## Steps

1. Install dependencies:

   ```bash
   yarn install
   ```

   The committed `yarn.lock` pins exact, integrity-checked versions, so this
   resolves nothing from the registry.

2. Start the local Twenty server:

   ```bash
   yarn twenty docker:start
   ```

   Check the server status at any time with `yarn twenty docker:status`.

3. Start the development server and sync your app:

   ```bash
   yarn twenty dev
   ```

4. Open [http://localhost:2020](http://localhost:2020) and log in with the default development credentials: `tim@apple.dev` / `tim@apple.dev`.

5. In Settings -> Apps, set `ROCKETREACH_API_KEY`. The other variables listed in
   [README.md](README.md) are optional.

## Trying it out

Open People, select a few records with an email or LinkedIn URL, and run
**Enrich people** from the command menu. The "Enriched (RocketReach)" view shows
what came back, including the enrichment status of each record.

## Verifying your setup

- `yarn lint` - Lint the project with oxlint
- `yarn typecheck` - Type-check the project
- `yarn test:unit` - Run unit tests
- `yarn test` - Run integration tests (needs a running Twenty server)

## Troubleshooting

`ROCKETREACH_API_KEY is not set` means the server variable is missing in
Settings -> Apps. An HTTP 403 from RocketReach usually means the key has no
Universal Credit access; contact RocketReach support.

If enrichment runs slowly or returns rate-limit errors, lower
`ROCKETREACH_LOOKUP_CONCURRENCY`. RocketReach allows 10 requests per second
across all APIs and far fewer per minute on the lower plans.

See the [troubleshooting guide](https://docs.twenty.com/developers/extend/apps/getting-started/troubleshooting) or ask on [Discord](https://discord.gg/cx5n4Jzs57).
