import { DROPCONTACT_ACCOUNT_ERROR_HTTP_STATUSES } from 'src/constants/dropcontact-account-error-http-statuses';
import { type DropcontactEnrichResult } from 'src/types/dropcontact-enrich-result';

export const isDropcontactAccountErrorOutcome = <TData>(
  enrichmentOutcome: DropcontactEnrichResult<TData> | undefined,
): boolean =>
  enrichmentOutcome?.outcome === 'error' &&
  DROPCONTACT_ACCOUNT_ERROR_HTTP_STATUSES.has(enrichmentOutcome.httpStatus);
