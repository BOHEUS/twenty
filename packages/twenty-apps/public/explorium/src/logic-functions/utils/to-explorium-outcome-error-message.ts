import { EXPLORIUM_ACCESS_ERROR_MESSAGE } from 'src/constants/explorium-access-error-message';
import { isExploriumAccountErrorOutcome } from 'src/logic-functions/utils/is-explorium-account-error-outcome';
import { type ExploriumEnrichResult } from 'src/types/explorium-enrich-result';
import { isDefined } from 'src/utils/is-defined';

const NO_RESPONSE_MESSAGE = 'Explorium returned no response for this record.';

type ExploriumErrorOutcome = Extract<
  ExploriumEnrichResult<unknown>,
  { outcome: 'error' }
>;

export const toExploriumOutcomeErrorMessage = (
  enrichmentOutcome: ExploriumErrorOutcome | undefined,
): string => {
  if (!isDefined(enrichmentOutcome)) {
    return NO_RESPONSE_MESSAGE;
  }

  return isExploriumAccountErrorOutcome(enrichmentOutcome)
    ? EXPLORIUM_ACCESS_ERROR_MESSAGE
    : enrichmentOutcome.message;
};
