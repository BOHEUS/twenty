import { SNOV_ACCOUNT_ERROR_HTTP_STATUSES } from 'src/constants/snov-account-error-http-statuses';
import { type SnovEnrichResult } from 'src/types/snov-enrich-result';

export const isSnovAccountErrorOutcome = <TData>(
  enrichmentOutcome: SnovEnrichResult<TData> | undefined,
): boolean =>
  enrichmentOutcome?.outcome === 'error' &&
  SNOV_ACCOUNT_ERROR_HTTP_STATUSES.has(enrichmentOutcome.httpStatus);
