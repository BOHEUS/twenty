import { chargeAmplemarketCredits } from 'src/logic-functions/utils/charge-amplemarket-credits';
import { getAmplemarketCreditCosts } from 'src/logic-functions/utils/get-amplemarket-credit-costs';
import { lookupAmplemarketPerson } from 'src/logic-functions/utils/lookup-amplemarket-person';
import { resolveContactTypes } from 'src/logic-functions/utils/resolve-contact-types';
import { runAmplemarketLookups } from 'src/logic-functions/utils/run-amplemarket-lookups';
import { type AmplemarketEnrichResult } from 'src/types/amplemarket-enrich-result';
import { type AmplemarketPerson } from 'src/types/amplemarket-person';
import { type AmplemarketPersonMatchParams } from 'src/types/amplemarket-person-match-params';
import { type AmplemarketUsage } from 'src/types/amplemarket-usage';

export const enrichPeople = async (
  params: AmplemarketPersonMatchParams[],
  { deadline }: { deadline: number },
): Promise<AmplemarketEnrichResult<AmplemarketPerson>[]> => {
  const creditCosts = getAmplemarketCreditCosts();
  const contactTypes = resolveContactTypes();
  const usage: AmplemarketUsage = {
    emailCredits: 0,
    phoneCredits: 0,
    billedRecords: 0,
  };

  try {
    return await runAmplemarketLookups({
      params,
      deadline,
      lookup: (entry) =>
        lookupAmplemarketPerson({
          params: entry,
          contactTypes,
          usage,
          deadline,
        }),
    });
  } finally {
    await chargeAmplemarketCredits({
      usage,
      creditCosts,
      resourceContext: 'amplemarket/person',
    });
  }
};
