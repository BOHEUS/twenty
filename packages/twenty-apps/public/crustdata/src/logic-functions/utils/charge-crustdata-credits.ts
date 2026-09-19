import { chargeCredits } from 'twenty-sdk/billing';

import { BILLING_MARGIN_MULTIPLIER } from 'src/constants/billing-margin-multiplier';
import { MICRO_CREDITS_PER_DOLLAR } from 'src/constants/micro-credits-per-dollar';
import { toNumber } from 'src/logic-functions/utils/to-number';
import { isDefined } from 'src/utils/is-defined';

const DEFAULT_CREDIT_COST_DOLLARS = 0.01;

const resolveCreditCostDollars = (): number => {
  const configuredCost = toNumber(
    Number.parseFloat(process.env.CRUSTDATA_CREDIT_COST_DOLLARS ?? ''),
  );

  return isDefined(configuredCost) && configuredCost > 0
    ? configuredCost
    : DEFAULT_CREDIT_COST_DOLLARS;
};

// Crustdata reports what each call actually cost in the x-credits-used header, so the workspace is
// billed on the real figure rather than on a per-match estimate.
export const chargeCrustdataCredits = async ({
  creditsUsed,
  matchedCount,
  resourceContext,
}: {
  creditsUsed: number;
  matchedCount: number;
  resourceContext: string;
}): Promise<void> => {
  if (creditsUsed <= 0) {
    return;
  }

  const creditsUsedMicro = Math.round(
    creditsUsed *
      resolveCreditCostDollars() *
      BILLING_MARGIN_MULTIPLIER *
      MICRO_CREDITS_PER_DOLLAR,
  );

  if (creditsUsedMicro <= 0) {
    return;
  }

  await chargeCredits({
    creditsUsedMicro,
    operationType: 'CODE_EXECUTION',
    quantity: matchedCount,
    resourceContext,
  });
};
