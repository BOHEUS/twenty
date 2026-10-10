import { SNOV_TIME_LIMIT_MESSAGE } from 'src/constants/snov-time-limit-message';
import { chargeSnovCredits } from 'src/logic-functions/utils/charge-snov-credits';
import { getSnovCreditCostDollars } from 'src/logic-functions/utils/get-snov-credit-cost-dollars';
import { searchSnovDomain } from 'src/logic-functions/utils/search-snov-domain';
import { type SnovCompanyData } from 'src/types/snov-company-data';
import { type SnovEnrichResult } from 'src/types/snov-enrich-result';

const RESOURCE_CONTEXT = 'snov/company';

export const enrichCompanies = async (
  domains: string[],
  { deadline }: { deadline: number },
): Promise<SnovEnrichResult<SnovCompanyData>[]> => {
  const creditCostDollars = getSnovCreditCostDollars();
  const results: SnovEnrichResult<SnovCompanyData>[] = [];

  for (const domain of domains) {
    results.push(
      Date.now() > deadline
        ? { outcome: 'error', httpStatus: 0, message: SNOV_TIME_LIMIT_MESSAGE }
        : await searchSnovDomain({ domain, deadline }),
    );
  }

  await chargeSnovCredits({
    // Snov.io charges one credit per domain search that returns results
    snovCredits: results.filter((result) => result.outcome === 'matched')
      .length,
    creditCostDollars,
    resourceContext: RESOURCE_CONTEXT,
  });

  return results;
};
