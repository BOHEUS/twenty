import { HUNTER_ENRICHMENT_CREDITS } from 'src/constants/hunter-credit-costs';
import { HUNTER_TIME_LIMIT_MESSAGE } from 'src/constants/hunter-time-limit-message';
import { callHunter } from 'src/logic-functions/utils/call-hunter';
import { chargeHunterCredits } from 'src/logic-functions/utils/charge-hunter-credits';
import { getHunterCreditCostDollars } from 'src/logic-functions/utils/get-hunter-credit-cost-dollars';
import { hasCoreCompanyData } from 'src/logic-functions/utils/has-core-company-data';
import { type HunterCompany } from 'src/types/hunter-company';
import { type HunterEnrichResult } from 'src/types/hunter-enrich-result';

const lookupHunterCompany = async (
  domain: string,
): Promise<HunterEnrichResult<HunterCompany>> => {
  const company = await callHunter({
    path: '/companies/find',
    query: { domain },
  });

  if (company.status === 'error') {
    return {
      outcome: 'error',
      httpStatus: company.httpStatus,
      message: company.message,
    };
  }

  // The response body is untyped JSON; fields are read defensively by the mappers
  return company.status === 'found'
    ? { outcome: 'matched', data: company.json as HunterCompany }
    : { outcome: 'not_found' };
};

export const enrichCompanies = async (
  domains: string[],
  { deadline }: { deadline: number },
): Promise<HunterEnrichResult<HunterCompany>[]> => {
  const creditCostDollars = getHunterCreditCostDollars();
  const results: HunterEnrichResult<HunterCompany>[] = [];

  try {
    for (const domain of domains) {
      results.push(
        Date.now() > deadline
          ? {
              outcome: 'error',
              httpStatus: 0,
              message: HUNTER_TIME_LIMIT_MESSAGE,
            }
          : await lookupHunterCompany(domain),
      );
    }
  } finally {
    const billedCalls = results.filter(
      (result) =>
        result.outcome === 'matched' && hasCoreCompanyData(result.data),
    ).length;

    await chargeHunterCredits({
      hunterCredits: billedCalls * HUNTER_ENRICHMENT_CREDITS,
      billedCalls,
      creditCostDollars,
      resourceContext: 'hunter/company',
    });
  }

  return results;
};
