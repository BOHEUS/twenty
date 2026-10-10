import { HUNTER_ACCESS_ERROR_MESSAGE } from 'src/constants/hunter-access-error-message';
import { isHunterAccountErrorOutcome } from 'src/logic-functions/utils/is-hunter-account-error-outcome';
import { type HunterEnrichResult } from 'src/types/hunter-enrich-result';
import { isDefined } from 'src/utils/is-defined';

const NO_RESPONSE_MESSAGE = 'Hunter returned no response for this record.';

type HunterErrorOutcome = Extract<
  HunterEnrichResult<unknown>,
  { outcome: 'error' }
>;

export const toHunterOutcomeErrorMessage = (
  enrichmentOutcome: HunterErrorOutcome | undefined,
): string => {
  if (!isDefined(enrichmentOutcome)) {
    return NO_RESPONSE_MESSAGE;
  }

  return isHunterAccountErrorOutcome(enrichmentOutcome)
    ? HUNTER_ACCESS_ERROR_MESSAGE
    : enrichmentOutcome.message;
};
