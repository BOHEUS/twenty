import { beforeEach, describe, expect, it, vi } from 'vitest';
import { chargeCredits } from 'twenty-sdk/billing';

import { COMPANY_REDEEM_COST_DOLLARS } from 'src/constants/company-redeem-cost-dollars';
import { PERSON_REDEEM_COST_DOLLARS } from 'src/constants/person-redeem-cost-dollars';
import { chargeRedeemedEnrichments } from 'src/logic-functions/utils/charge-redeemed-enrichments';

vi.mock('twenty-sdk/billing', () => ({
  chargeCredits: vi.fn(async () => undefined),
}));

describe('chargeRedeemedEnrichments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('charges redeemed contacts at the Cognism list price plus margin', async () => {
    await chargeRedeemedEnrichments({
      redeemedCount: 3,
      costPerRedeemDollars: PERSON_REDEEM_COST_DOLLARS,
      resourceContext: 'cognism/person',
    });

    expect(chargeCredits).toHaveBeenCalledExactlyOnceWith({
      creditsUsedMicro: 3 * 300_000,
      operationType: 'CODE_EXECUTION',
      quantity: 3,
      resourceContext: 'cognism/person',
    });
  });

  it('charges redeemed accounts at the Cognism list price plus margin', async () => {
    await chargeRedeemedEnrichments({
      redeemedCount: 2,
      costPerRedeemDollars: COMPANY_REDEEM_COST_DOLLARS,
      resourceContext: 'cognism/company',
    });

    expect(chargeCredits).toHaveBeenCalledExactlyOnceWith({
      creditsUsedMicro: 2 * 120_000,
      operationType: 'CODE_EXECUTION',
      quantity: 2,
      resourceContext: 'cognism/company',
    });
  });

  it('does not charge when nothing was redeemed', async () => {
    await chargeRedeemedEnrichments({
      redeemedCount: 0,
      costPerRedeemDollars: PERSON_REDEEM_COST_DOLLARS,
      resourceContext: 'cognism/person',
    });

    expect(chargeCredits).not.toHaveBeenCalled();
  });
});
