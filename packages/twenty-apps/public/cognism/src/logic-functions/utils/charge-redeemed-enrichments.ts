import { chargeCredits } from 'twenty-sdk/billing';

import { BILLING_MARGIN_MULTIPLIER } from 'src/constants/billing-margin-multiplier';
import { MICRO_CREDITS_PER_DOLLAR } from 'src/constants/micro-credits-per-dollar';

// Cognism bills on redeem, not on enrich, so only records whose full profile
// came back are charged.
export const chargeRedeemedEnrichments = async ({
  redeemedCount,
  costPerRedeemDollars,
  resourceContext,
}: {
  redeemedCount: number;
  costPerRedeemDollars: number;
  resourceContext: string;
}): Promise<void> => {
  if (redeemedCount === 0) {
    return;
  }

  const creditsPerRedeemMicro = Math.round(
    costPerRedeemDollars * BILLING_MARGIN_MULTIPLIER * MICRO_CREDITS_PER_DOLLAR,
  );

  await chargeCredits({
    creditsUsedMicro: redeemedCount * creditsPerRedeemMicro,
    operationType: 'CODE_EXECUTION',
    quantity: redeemedCount,
    resourceContext,
  });
};
