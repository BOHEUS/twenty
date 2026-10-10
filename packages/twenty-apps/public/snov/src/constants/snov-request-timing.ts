// Snov.io allows 60 requests per minute across all endpoints, so requests are
// spaced one second apart and a run stops starting new records before the
// 300s function timeout.
export const SNOV_REQUEST_INTERVAL_MS = 1_000;
export const SNOV_TASK_POLL_INTERVAL_MS = 3_000;
export const SNOV_RUN_BUDGET_MS = 240_000;
