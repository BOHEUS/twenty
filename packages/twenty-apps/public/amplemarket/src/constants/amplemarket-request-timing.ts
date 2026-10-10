// Amplemarket allows 350 requests per minute on /people/find and 500 on other
// endpoints, so requests are spaced 200ms apart. A run stops starting new
// records after its budget, and a started request is aborted after its timeout,
// so the run ends before the 300s function timeout.
export const AMPLEMARKET_REQUEST_INTERVAL_MS = 200;
export const AMPLEMARKET_REQUEST_TIMEOUT_MS = 30_000;
export const AMPLEMARKET_RUN_BUDGET_MS = 240_000;
