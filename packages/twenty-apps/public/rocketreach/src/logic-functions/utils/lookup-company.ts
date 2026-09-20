import { getRocketReach } from 'src/logic-functions/utils/get-rocketreach';
import { parseCompanyLookupResponse } from 'src/logic-functions/utils/parse-company-lookup-response';
import { type RocketReachCompanyData } from 'src/types/rocketreach-company-data';
import { type RocketReachCompanyLookupParams } from 'src/types/rocketreach-company-lookup-params';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';
import { isDefined } from 'src/logic-functions/utils/is-defined';

const COMPANY_LOOKUP_PATH = '/universal/company/lookup';

const toCompanyQueryParams = (
  params: RocketReachCompanyLookupParams,
): Record<string, string> => {
  if (isDefined(params.companyId)) {
    return { id: String(params.companyId) };
  }

  if (isDefined(params.domain)) {
    return { domain: params.domain };
  }

  if (isDefined(params.linkedinUrl)) {
    return { linkedin_url: params.linkedinUrl };
  }

  return isDefined(params.name) ? { name: params.name } : {};
};

export const lookupCompany = async (
  params: RocketReachCompanyLookupParams,
): Promise<RocketReachLookupResult<RocketReachCompanyData>> => {
  const response = await getRocketReach({
    path: COMPANY_LOOKUP_PATH,
    params: toCompanyQueryParams(params),
  });

  if (!response.ok) {
    return {
      outcome: 'error',
      httpStatus: response.httpStatus,
      message: response.message,
    };
  }

  return parseCompanyLookupResponse({
    json: response.json,
    httpStatus: response.httpStatus,
  });
};
