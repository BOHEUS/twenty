import { lookupCompany } from 'src/logic-functions/utils/lookup-company';
import { resolveLookupConcurrency } from 'src/logic-functions/utils/resolve-lookup-concurrency';
import { runWithConcurrency } from 'src/logic-functions/utils/run-with-concurrency';
import { type RocketReachCompanyData } from 'src/types/rocketreach-company-data';
import { type RocketReachCompanyLookupParams } from 'src/types/rocketreach-company-lookup-params';
import { type RocketReachLookupResult } from 'src/types/rocketreach-lookup-result';

export const lookupCompanies = ({
  params,
}: {
  params: RocketReachCompanyLookupParams[];
}): Promise<RocketReachLookupResult<RocketReachCompanyData>[]> =>
  runWithConcurrency({
    items: params,
    concurrency: resolveLookupConcurrency(),
    run: lookupCompany,
  });
