import { chargeCredits } from 'twenty-sdk/billing';

import { BILLING_MARGIN_MULTIPLIER } from 'src/constants/billing-margin-multiplier';
import { MICRO_CREDITS_PER_DOLLAR } from 'src/constants/micro-credits-per-dollar';

export const chargeHunterCredits = async ({
  hunterCredits,
  billedCalls,
  creditCostDollars,
  resourceContext,
}: {
  hunterCredits: number;
  billedCalls: number;
  creditCostDollars: number;
  resourceContext: string;
}): Promise<void> => {
  if (hunterCredits <= 0 || billedCalls <= 0) {
    return;
  }

  const creditsUsedMicro = Math.round(
    hunterCredits *
      creditCostDollars *
      BILLING_MARGIN_MULTIPLIER *
      MICRO_CREDITS_PER_DOLLAR,
  );

  await chargeCredits({
    creditsUsedMicro,
    operationType: 'CODE_EXECUTION',
    // Enrichment costs 0.2 Hunter credits, so the quantity counts billed calls
    // and the fractional cost is carried by creditsUsedMicro
    quantity: billedCalls,
    resourceContext,
  });
};
