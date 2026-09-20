import { ROCKETREACH_ACCOUNT_ERROR_HTTP_STATUSES } from 'src/constants/rocketreach-account-error-http-statuses';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';

export const isRocketReachAccountErrorOutcome = <TData>(
  lookupResult: RocketReachLookupResult<TData> | undefined,
): boolean =>
  lookupResult?.outcome === 'error' &&
  ROCKETREACH_ACCOUNT_ERROR_HTTP_STATUSES.has(lookupResult.httpStatus);
