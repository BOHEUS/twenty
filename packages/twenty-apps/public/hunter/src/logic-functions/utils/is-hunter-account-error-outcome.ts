import { HUNTER_ACCOUNT_ERROR_HTTP_STATUSES } from 'src/constants/hunter-account-error-http-statuses';
import { type HunterEnrichResult } from 'src/types/hunter-enrich-result';

export const isHunterAccountErrorOutcome = <TData>(
  enrichmentOutcome: HunterEnrichResult<TData> | undefined,
): boolean =>
  enrichmentOutcome?.outcome === 'error' &&
  HUNTER_ACCOUNT_ERROR_HTTP_STATUSES.has(enrichmentOutcome.httpStatus);
