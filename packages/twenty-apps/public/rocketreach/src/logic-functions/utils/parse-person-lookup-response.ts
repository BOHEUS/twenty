import { isObject } from '@sniptt/guards';

import { extractRocketReachErrorMessage } from 'src/logic-functions/utils/extract-rocketreach-error-message';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { toText } from 'src/logic-functions/utils/to-text';
import { ROCKETREACH_LOOKUP_STATUS } from 'src/types/rocketreach-lookup-status';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';
import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';

const NOT_FOUND_STATUS = 404;

export const parsePersonLookupResponse = ({
  json,
  httpStatus,
}: {
  json: unknown;
  httpStatus: number;
}): RocketReachLookupResult<RocketReachPersonData> => {
  if (httpStatus === NOT_FOUND_STATUS) {
    return { outcome: 'not_found', httpStatus };
  }

  if (httpStatus < 200 || httpStatus >= 300) {
    return {
      outcome: 'error',
      httpStatus,
      message: extractRocketReachErrorMessage({ json, httpStatus }),
    };
  }

  if (!isObject(json)) {
    return {
      outcome: 'error',
      httpStatus,
      message: 'RocketReach returned a malformed person profile.',
    };
  }

  const personData = json as RocketReachPersonData;
  const profileId = toNumber(personData.id);

  if (toText(personData.status) !== ROCKETREACH_LOOKUP_STATUS.complete) {
    return { outcome: 'pending', httpStatus, profileId, data: personData };
  }

  return { outcome: 'matched', httpStatus, data: personData };
};
