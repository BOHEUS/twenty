import { chargeCredits } from 'twenty-sdk/billing';

import {
  BILLING_MARGIN_MULTIPLIER,
  ENRICHMENT_BILLABLE_OPERATION_NAME,
  LUSHA_CREDIT_COST_DOLLARS,
  MICRO_CREDITS_PER_DOLLAR,
} from 'src/constants/billing.constant';

// Charged on what Lusha billed the run, so revealing phone numbers costs the
// workspace more than emails, the way it costs the instance more.
export const chargeEnrichment = async ({
  lushaCreditsCharged,
}: {
  lushaCreditsCharged: number;
}): Promise<void> => {
  if (lushaCreditsCharged === 0) {
    return;
  }

  await chargeCredits({
    creditsUsedMicro: Math.round(
      lushaCreditsCharged *
        LUSHA_CREDIT_COST_DOLLARS *
        BILLING_MARGIN_MULTIPLIER *
        MICRO_CREDITS_PER_DOLLAR,
    ),
    quantity: lushaCreditsCharged,
    operation: ENRICHMENT_BILLABLE_OPERATION_NAME,
  });
};
