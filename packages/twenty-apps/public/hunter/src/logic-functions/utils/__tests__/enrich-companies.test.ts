import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chargeCredits } from 'twenty-sdk/billing';

import { HUNTER_COMPANY_DATA_MOCK } from 'src/logic-functions/__mocks__/hunter-company-data.mock';
import {
  jsonResponse,
  stubHunterFetch,
} from 'src/logic-functions/__mocks__/hunter-fetch-stub';
import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';

vi.mock('twenty-sdk/billing', () => ({
  chargeCredits: vi.fn(async () => undefined),
}));

vi.mock('src/logic-functions/utils/wait-for-hunter-rate-limit', () => ({
  waitForHunterRateLimit: vi.fn(async () => undefined),
}));

describe('enrichCompanies', () => {
  beforeEach(() => {
    vi.stubEnv('HUNTER_API_KEY', 'secret-key');
    vi.stubEnv('HUNTER_CREDIT_COST_DOLLARS', '0.1');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.mocked(chargeCredits).mockClear();
  });

  it('enriches each domain and bills only complete company data', async () => {
    stubHunterFetch(({ url }) => {
      const domain = url.searchParams.get('domain');

      if (domain === 'acme.com') {
        return jsonResponse(200, { data: HUNTER_COMPANY_DATA_MOCK });
      }

      return domain === 'thin.example'
        ? jsonResponse(200, { data: { name: 'Thin' } })
        : jsonResponse(404, { errors: [] });
    });

    const results = await enrichCompanies(
      ['acme.com', 'thin.example', 'unknown.example'],
      { deadline: Date.now() + 60_000 },
    );

    expect(results.map((result) => result.outcome)).toEqual([
      'matched',
      'matched',
      'not_found',
    ]);
    expect(chargeCredits).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        creditsUsedMicro: 24_000,
        quantity: 1,
        resourceContext: 'hunter/company',
      }),
    );
  });
});
