// Hunter allows 15 requests per second and 500 per minute on each endpoint;
// spacing requests 150ms apart stays under both, and a run stops starting new
// records before the 300s function timeout.
export const HUNTER_REQUEST_INTERVAL_MS = 150;
export const HUNTER_RUN_BUDGET_MS = 240_000;
