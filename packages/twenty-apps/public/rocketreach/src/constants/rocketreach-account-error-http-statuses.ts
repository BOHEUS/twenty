// 401 is a bad key, 403 an API key without Universal Credit access: both are
// workspace-wide, so one is enough to stop the whole run.
export const ROCKETREACH_ACCOUNT_ERROR_HTTP_STATUSES: ReadonlySet<number> =
  new Set([401, 403]);
