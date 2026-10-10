import { AMPLEMARKET_ACCESS_ERROR_MESSAGE } from 'src/constants/amplemarket-access-error-message';
import { isAmplemarketAccountErrorOutcome } from 'src/logic-functions/utils/is-amplemarket-account-error-outcome';
import { type AmplemarketEnrichResult } from 'src/types/amplemarket-enrich-result';
import { isDefined } from 'src/utils/is-defined';

const NO_RESPONSE_MESSAGE = 'Amplemarket returned no response for this record.';

type AmplemarketErrorOutcome = Extract<
  AmplemarketEnrichResult<unknown>,
  { outcome: 'error' }
>;

export const toAmplemarketOutcomeErrorMessage = (
  enrichmentOutcome: AmplemarketErrorOutcome | undefined,
): string => {
  if (!isDefined(enrichmentOutcome)) {
    return NO_RESPONSE_MESSAGE;
  }

  return isAmplemarketAccountErrorOutcome(enrichmentOutcome)
    ? AMPLEMARKET_ACCESS_ERROR_MESSAGE
    : enrichmentOutcome.message;
};
