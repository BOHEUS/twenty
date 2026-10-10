import { AMPLEMARKET_ACCOUNT_ERROR_HTTP_STATUSES } from 'src/constants/amplemarket-account-error-http-statuses';
import { type AmplemarketEnrichResult } from 'src/types/amplemarket-enrich-result';

export const isAmplemarketAccountErrorOutcome = <TData>(
  enrichmentOutcome: AmplemarketEnrichResult<TData> | undefined,
): boolean =>
  enrichmentOutcome?.outcome === 'error' &&
  AMPLEMARKET_ACCOUNT_ERROR_HTTP_STATUSES.has(enrichmentOutcome.httpStatus);
