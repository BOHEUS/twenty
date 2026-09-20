import { isObject } from '@sniptt/guards';

import { extractRocketReachErrorMessage } from 'src/logic-functions/utils/extract-rocketreach-error-message';
import { type RocketReachCompanyData } from 'src/types/rocketreach-company-data';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';

const NOT_FOUND_STATUS = 404;

export const parseCompanyLookupResponse = ({
  json,
  httpStatus,
}: {
  json: unknown;
  httpStatus: number;
}): RocketReachLookupResult<RocketReachCompanyData> => {
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
      message: 'RocketReach returned a malformed company profile.',
    };
  }

  const companyData = json as RocketReachCompanyData;

  if (Object.keys(companyData).length === 0) {
    return { outcome: 'not_found', httpStatus };
  }

  return { outcome: 'matched', httpStatus, data: companyData };
};
