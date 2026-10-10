import { DROPCONTACT_ACCESS_ERROR_MESSAGE } from 'src/constants/dropcontact-access-error-message';
import { isDropcontactAccountErrorOutcome } from 'src/logic-functions/utils/is-dropcontact-account-error-outcome';
import { type DropcontactEnrichResult } from 'src/types/dropcontact-enrich-result';
import { isDefined } from 'src/utils/is-defined';

const NO_RESPONSE_MESSAGE = 'Dropcontact returned no response for this record.';

type DropcontactErrorOutcome = Extract<
  DropcontactEnrichResult<unknown>,
  { outcome: 'error' }
>;

export const toDropcontactOutcomeErrorMessage = (
  enrichmentOutcome: DropcontactErrorOutcome | undefined,
): string => {
  if (!isDefined(enrichmentOutcome)) {
    return NO_RESPONSE_MESSAGE;
  }

  return isDropcontactAccountErrorOutcome(enrichmentOutcome)
    ? DROPCONTACT_ACCESS_ERROR_MESSAGE
    : enrichmentOutcome.message;
};
