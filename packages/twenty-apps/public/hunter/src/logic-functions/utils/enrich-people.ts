import { HUNTER_TIME_LIMIT_MESSAGE } from 'src/constants/hunter-time-limit-message';
import { chargeHunterCredits } from 'src/logic-functions/utils/charge-hunter-credits';
import { getHunterCreditCostDollars } from 'src/logic-functions/utils/get-hunter-credit-cost-dollars';
import {
  type HunterUsage,
  lookupHunterPerson,
} from 'src/logic-functions/utils/lookup-hunter-person';
import { readFindMissingEmailsSetting } from 'src/logic-functions/utils/read-find-missing-emails-setting';
import { type HunterEnrichResult } from 'src/types/hunter-enrich-result';
import { type HunterPersonData } from 'src/types/hunter-person-data';
import { type HunterPersonMatchParams } from 'src/types/hunter-person-match-params';

export const enrichPeople = async (
  params: HunterPersonMatchParams[],
  { deadline }: { deadline: number },
): Promise<HunterEnrichResult<HunterPersonData>[]> => {
  const creditCostDollars = getHunterCreditCostDollars();
  const shouldFindMissingEmails = readFindMissingEmailsSetting();
  const usage: HunterUsage = { credits: 0, billedCalls: 0 };
  const results: HunterEnrichResult<HunterPersonData>[] = [];

  try {
    for (const entry of params) {
      results.push(
        Date.now() > deadline
          ? {
              outcome: 'error',
              httpStatus: 0,
              message: HUNTER_TIME_LIMIT_MESSAGE,
            }
          : await lookupHunterPerson({
              params: entry,
              shouldFindMissingEmails,
              usage,
            }),
      );
    }
  } finally {
    await chargeHunterCredits({
      hunterCredits: usage.credits,
      billedCalls: usage.billedCalls,
      creditCostDollars,
      resourceContext: 'hunter/person',
    });
  }

  return results;
};
