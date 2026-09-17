import { LUSHA_REQUEST_TIMEOUT_MILLISECONDS } from 'src/constants/lusha-api.constant';

export const ENRICHMENT_TIMEOUT_SECONDS = 300;

const BATCH_WRITE_ALLOWANCE_MILLISECONDS = 30_000;

// A run killed at its timeout takes its report with it, so a batch only starts
// while a Lusha request that runs into its timeout and the writes that follow
// it still fit.
export const ENRICHMENT_RUN_BUDGET_MILLISECONDS =
  ENRICHMENT_TIMEOUT_SECONDS * 1_000 -
  LUSHA_REQUEST_TIMEOUT_MILLISECONDS -
  BATCH_WRITE_ALLOWANCE_MILLISECONDS;

// Every enriched record spends at least one API request, and the server
// throttles an application to a few hundred requests a minute across
// workspaces, so a batch goes out in waves instead of all at once.
export const ENRICHMENT_CONCURRENCY = 20;
