import { EXPLORIUM_ACCOUNT_ERROR_HTTP_STATUSES } from 'src/constants/explorium-account-error-http-statuses';
import { type ExploriumEnrichResult } from 'src/types/explorium-enrich-result';

export const isExploriumAccountErrorOutcome = <TData>(
  enrichmentOutcome: ExploriumEnrichResult<TData> | undefined,
): boolean =>
  enrichmentOutcome?.outcome === 'error' &&
  EXPLORIUM_ACCOUNT_ERROR_HTTP_STATUSES.has(enrichmentOutcome.httpStatus);
