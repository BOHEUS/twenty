import { afterEach, describe, expect, it, vi } from 'vitest';

const chargeCreditsMock = vi.fn();

vi.mock('twenty-sdk/billing', () => ({
  chargeCredits: (args: unknown) => chargeCreditsMock(args),
}));

const { chargeCrustdataCredits } = await import(
  'src/logic-functions/utils/charge-crustdata-credits'
);

afterEach(() => {
  chargeCreditsMock.mockClear();
  delete process.env.CRUSTDATA_CREDIT_COST_DOLLARS;
});

describe('chargeCrustdataCredits', () => {
  it('bills the credits the API reported, at the default rate plus margin', async () => {
    await chargeCrustdataCredits({
      creditsUsed: 7,
      matchedCount: 1,
      resourceContext: 'crustdata/person',
    });

    expect(chargeCreditsMock).toHaveBeenCalledWith({
      creditsUsedMicro: 84_000,
      operationType: 'CODE_EXECUTION',
      quantity: 1,
      resourceContext: 'crustdata/person',
    });
  });

  it('uses the configured credit cost when one is set', async () => {
    process.env.CRUSTDATA_CREDIT_COST_DOLLARS = '0.05';

    await chargeCrustdataCredits({
      creditsUsed: 2,
      matchedCount: 1,
      resourceContext: 'crustdata/company',
    });

    expect(chargeCreditsMock).toHaveBeenCalledWith(
      expect.objectContaining({ creditsUsedMicro: 120_000 }),
    );
  });

  it('bills nothing when the call reported no credits', async () => {
    await chargeCrustdataCredits({
      creditsUsed: 0,
      matchedCount: 0,
      resourceContext: 'crustdata/person',
    });

    expect(chargeCreditsMock).not.toHaveBeenCalled();
  });
});
