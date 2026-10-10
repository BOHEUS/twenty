import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chargeCredits } from 'twenty-sdk/billing';

import {
  jsonResponse,
  stubSnovFetch,
} from 'src/logic-functions/__mocks__/snov-fetch-stub';
import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';
import { resetSnovAccessTokenCache } from 'src/logic-functions/utils/get-snov-access-token';

vi.mock('twenty-sdk/billing', () => ({
  chargeCredits: vi.fn(async () => undefined),
}));

vi.mock('src/logic-functions/utils/wait-for-snov-rate-limit', () => ({
  waitForSnovRateLimit: vi.fn(async () => undefined),
}));

vi.mock('src/logic-functions/utils/sleep', () => ({
  sleep: vi.fn(async () => undefined),
}));

describe('enrichCompanies', () => {
  beforeEach(() => {
    resetSnovAccessTokenCache();
    vi.stubEnv('SNOV_CLIENT_ID', 'client-id');
    vi.stubEnv('SNOV_CLIENT_SECRET', 'client-secret');
    vi.stubEnv('SNOV_CREDIT_COST_DOLLARS', '0.1');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.mocked(chargeCredits).mockClear();
  });

  it('runs a domain search per company and bills only the ones found', async () => {
    const calls = stubSnovFetch(({ url, body }) => {
      if (url.endsWith('/v2/domain-search/start')) {
        return jsonResponse(200, {
          data: [],
          meta: {
            task_hash: body === 'domain=acme.com' ? 'hash-acme' : 'hash-x',
          },
        });
      }

      return url.endsWith('/hash-acme')
        ? jsonResponse(200, {
            status: 'completed',
            data: { company_name: 'Acme Corp', industry: 'Manufacturing' },
          })
        : jsonResponse(200, { status: 'completed', data: [] });
    });

    const results = await enrichCompanies(['acme.com', 'unknown.example'], {
      deadline: Date.now() + 60_000,
    });

    expect(
      calls.some((call) =>
        call.url.endsWith('/v2/domain-search/result/hash-acme'),
      ),
    ).toBe(true);
    expect(results).toEqual([
      {
        outcome: 'matched',
        data: { company_name: 'Acme Corp', industry: 'Manufacturing' },
      },
      { outcome: 'not_found' },
    ]);
    expect(chargeCredits).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 1, resourceContext: 'snov/company' }),
    );
  });
});
