import { SNOV_ACCESS_ERROR_MESSAGE } from 'src/constants/snov-access-error-message';
import { isSnovAccountErrorOutcome } from 'src/logic-functions/utils/is-snov-account-error-outcome';
import { type SnovEnrichResult } from 'src/types/snov-enrich-result';
import { isDefined } from 'src/utils/is-defined';

const NO_RESPONSE_MESSAGE = 'Snov.io returned no response for this record.';

type SnovErrorOutcome = Extract<
  SnovEnrichResult<unknown>,
  { outcome: 'error' }
>;

export const toSnovOutcomeErrorMessage = (
  enrichmentOutcome: SnovErrorOutcome | undefined,
): string => {
  if (!isDefined(enrichmentOutcome)) {
    return NO_RESPONSE_MESSAGE;
  }

  return isSnovAccountErrorOutcome(enrichmentOutcome)
    ? SNOV_ACCESS_ERROR_MESSAGE
    : enrichmentOutcome.message;
};
