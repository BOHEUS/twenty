import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chargeCredits } from 'twenty-sdk/billing';

import { AMPLEMARKET_COMPANY_DATA_MOCK } from 'src/logic-functions/__mocks__/amplemarket-company-data.mock';
import {
  errorResponse,
  jsonResponse,
  stubAmplemarketFetch,
} from 'src/logic-functions/__mocks__/amplemarket-fetch-stub';
import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';

vi.mock('twenty-sdk/billing', () => ({
  chargeCredits: vi.fn(async () => undefined),
}));

vi.mock('src/logic-functions/utils/wait-for-amplemarket-rate-limit', () => ({
  waitForAmplemarketRateLimit: vi.fn(async () => undefined),
}));

describe('enrichCompanies', () => {
  beforeEach(() => {
    vi.stubEnv('AMPLEMARKET_API_KEY', 'secret-key');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('looks companies up by domain or LinkedIn URL without billing', async () => {
    const calls = stubAmplemarketFetch(({ url }) =>
      url.searchParams.get('domain') === 'acme.com'
        ? jsonResponse(200, AMPLEMARKET_COMPANY_DATA_MOCK)
        : errorResponse(404, 'company_not_found', 'Not found'),
    );

    const results = await enrichCompanies(
      [
        { domain: 'acme.com' },
        { linkedinUrl: 'https://linkedin.com/company/unknown' },
      ],
      { deadline: Date.now() + 60_000 },
    );

    expect(calls[1].url.searchParams.get('linkedin_url')).toBe(
      'https://linkedin.com/company/unknown',
    );
    expect(results).toEqual([
      { outcome: 'matched', data: AMPLEMARKET_COMPANY_DATA_MOCK },
      { outcome: 'not_found' },
    ]);
    expect(chargeCredits).not.toHaveBeenCalled();
  });
});
