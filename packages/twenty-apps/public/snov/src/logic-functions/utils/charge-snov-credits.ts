import { chargeCredits } from 'twenty-sdk/billing';

import { BILLING_MARGIN_MULTIPLIER } from 'src/constants/billing-margin-multiplier';
import { MICRO_CREDITS_PER_DOLLAR } from 'src/constants/micro-credits-per-dollar';

export const chargeSnovCredits = async ({
  snovCredits,
  creditCostDollars,
  resourceContext,
}: {
  snovCredits: number;
  creditCostDollars: number;
  resourceContext: string;
}): Promise<void> => {
  if (snovCredits <= 0) {
    return;
  }

  const creditsUsedMicro = Math.round(
    snovCredits *
      creditCostDollars *
      BILLING_MARGIN_MULTIPLIER *
      MICRO_CREDITS_PER_DOLLAR,
  );

  await chargeCredits({
    creditsUsedMicro,
    operationType: 'CODE_EXECUTION',
    quantity: snovCredits,
    resourceContext,
  });
};
