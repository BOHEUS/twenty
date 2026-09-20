import { isArray } from '@sniptt/guards';

import { getRocketReach } from 'src/logic-functions/utils/get-rocketreach';
import { parsePersonLookupResponse } from 'src/logic-functions/utils/parse-person-lookup-response';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';
import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';
import { isDefined } from 'src/logic-functions/utils/is-defined';

const CHECK_STATUS_PATH = '/universal/person/check_status';

export const checkPersonLookupStatus = async (
  profileIds: number[],
): Promise<Map<number, RocketReachLookupResult<RocketReachPersonData>>> => {
  const resultByProfileId = new Map<
    number,
    RocketReachLookupResult<RocketReachPersonData>
  >();

  if (profileIds.length === 0) {
    return resultByProfileId;
  }

  const response = await getRocketReach({
    path: CHECK_STATUS_PATH,
    params: { ids: profileIds.join(',') },
  });

  if (!response.ok || !isArray(response.json)) {
    return resultByProfileId;
  }

  for (const profile of response.json) {
    const profileId = toNumber((profile as RocketReachPersonData)?.id);
    if (!isDefined(profileId)) {
      continue;
    }

    resultByProfileId.set(
      profileId,
      parsePersonLookupResponse({
        json: profile,
        httpStatus: response.httpStatus,
      }),
    );
  }

  return resultByProfileId;
};
