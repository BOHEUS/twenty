import { ROCKETREACH_ACCESS_ERROR_MESSAGE } from 'src/constants/rocketreach-access-error-message';
import { isRocketReachAccountErrorOutcome } from 'src/logic-functions/utils/is-rocketreach-account-error-outcome';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';
import { isDefined } from 'src/logic-functions/utils/is-defined';

const NO_RESPONSE_MESSAGE =
  'RocketReach returned no response for this record.';

type LookupErrorOutcome = Extract<
  RocketReachLookupResult<unknown>,
  { outcome: 'error' }
>;

export const toLookupErrorMessage = (
  lookupResult: LookupErrorOutcome | undefined,
): string => {
  if (!isDefined(lookupResult)) {
    return NO_RESPONSE_MESSAGE;
  }

  return isRocketReachAccountErrorOutcome(lookupResult)
    ? ROCKETREACH_ACCESS_ERROR_MESSAGE
    : lookupResult.message;
};
