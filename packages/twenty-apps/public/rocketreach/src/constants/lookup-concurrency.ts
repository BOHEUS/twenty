// RocketReach caps every API at 10 requests per second across the account, and
// per-minute lookup budgets are far tighter on the lower plans.
export const DEFAULT_LOOKUP_CONCURRENCY = 4;
export const MAX_LOOKUP_CONCURRENCY = 10;
