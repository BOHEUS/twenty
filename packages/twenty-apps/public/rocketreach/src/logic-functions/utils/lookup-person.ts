import { getRocketReach } from 'src/logic-functions/utils/get-rocketreach';
import { parsePersonLookupResponse } from 'src/logic-functions/utils/parse-person-lookup-response';
import { toLookupQueryParams } from 'src/logic-functions/utils/to-lookup-query-params';
import { type RevealSettings } from 'src/types/reveal-settings';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';
import { type RocketReachPersonData } from 'src/types/rocketreach-person-data';
import { type RocketReachPersonLookupParams } from 'src/types/rocketreach-person-lookup-params';

const PERSON_LOOKUP_PATH = '/universal/person/lookup';

export const lookupPerson = async ({
  params,
  revealSettings,
}: {
  params: RocketReachPersonLookupParams;
  revealSettings: RevealSettings;
}): Promise<RocketReachLookupResult<RocketReachPersonData>> => {
  const response = await getRocketReach({
    path: PERSON_LOOKUP_PATH,
    params: toLookupQueryParams({ params, revealSettings }),
  });

  if (!response.ok) {
    return {
      outcome: 'error',
      httpStatus: response.httpStatus,
      message: response.message,
    };
  }

  return parsePersonLookupResponse({
    json: response.json,
    httpStatus: response.httpStatus,
  });
};
