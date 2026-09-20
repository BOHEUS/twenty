import { chargeCredits } from 'twenty-sdk/billing';

import { BILLING_MARGIN_MULTIPLIER } from 'src/constants/billing-margin-multiplier';
import { MICRO_CREDITS_PER_DOLLAR } from 'src/constants/micro-credits-per-dollar';
import { resolveCreditCostDollars } from 'src/logic-functions/utils/resolve-credit-cost-dollars';

export const chargeMatchedLookups = async ({
  matchedCount,
  rocketReachCreditsPerMatch,
  resourceContext,
}: {
  matchedCount: number;
  rocketReachCreditsPerMatch: number;
  resourceContext: string;
}): Promise<void> => {
  if (matchedCount === 0) {
    return;
  }

  const creditsPerMatchMicro = Math.round(
    rocketReachCreditsPerMatch *
      resolveCreditCostDollars() *
      BILLING_MARGIN_MULTIPLIER *
      MICRO_CREDITS_PER_DOLLAR,
  );

  await chargeCredits({
    creditsUsedMicro: matchedCount * creditsPerMatchMicro,
    operationType: 'CODE_EXECUTION',
    quantity: matchedCount,
    resourceContext,
  });
};
