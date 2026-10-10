import { chargeCredits } from 'twenty-sdk/billing';

import { BILLING_MARGIN_MULTIPLIER } from 'src/constants/billing-margin-multiplier';
import { MICRO_CREDITS_PER_DOLLAR } from 'src/constants/micro-credits-per-dollar';
import { type AmplemarketCreditCosts } from 'src/logic-functions/utils/get-amplemarket-credit-costs';
import { type AmplemarketUsage } from 'src/types/amplemarket-usage';
import { toErrorMessage } from 'src/utils/to-error-message';

export const chargeAmplemarketCredits = async ({
  usage,
  creditCosts,
  resourceContext,
}: {
  usage: AmplemarketUsage;
  creditCosts: AmplemarketCreditCosts;
  resourceContext: string;
}): Promise<void> => {
  const dollars =
    usage.emailCredits * creditCosts.emailCreditCostDollars +
    usage.phoneCredits * creditCosts.phoneCreditCostDollars;

  if (dollars <= 0 || usage.billedRecords <= 0) {
    return;
  }

  // Amplemarket has already charged for these lookups, so a billing failure
  // must not discard their results
  try {
    await chargeCredits({
      creditsUsedMicro: Math.round(
        dollars * BILLING_MARGIN_MULTIPLIER * MICRO_CREDITS_PER_DOLLAR,
      ),
      operationType: 'CODE_EXECUTION',
      // A person found costs half a credit, so the quantity counts billed
      // records and the cost is carried by creditsUsedMicro
      quantity: usage.billedRecords,
      resourceContext,
    });
  } catch (chargeError) {
    console.error(
      `Failed to charge credits for ${resourceContext}: ${toErrorMessage(chargeError)}`,
    );
  }
};
