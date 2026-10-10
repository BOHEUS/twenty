import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chargeCredits } from 'twenty-sdk/billing';

import { HUNTER_TIME_LIMIT_MESSAGE } from 'src/constants/hunter-time-limit-message';
import {
  jsonResponse,
  stubHunterFetch,
} from 'src/logic-functions/__mocks__/hunter-fetch-stub';
import { enrichPeople } from 'src/logic-functions/utils/enrich-people';

vi.mock('twenty-sdk/billing', () => ({
  chargeCredits: vi.fn(async () => undefined),
}));

vi.mock('src/logic-functions/utils/wait-for-hunter-rate-limit', () => ({
  waitForHunterRateLimit: vi.fn(async () => undefined),
}));

vi.mock('src/logic-functions/utils/sleep', () => ({
  sleep: vi.fn(async () => undefined),
}));

const FAR_DEADLINE = () => Date.now() + 60_000;

const PERSON = {
  email: 'jane@acme.com',
  name: { fullName: 'Jane Doe', givenName: 'Jane', familyName: 'Doe' },
  employment: { domain: 'acme.com', name: 'Acme', title: 'CEO' },
};

const COMPANY = {
  name: 'Acme',
  category: { industry: 'Manufacturing' },
  geo: { countryCode: 'US' },
  metrics: { employees: '51-250' },
};

describe('enrichPeople', () => {
  beforeEach(() => {
    vi.stubEnv('HUNTER_API_KEY', 'secret-key');
    vi.stubEnv('HUNTER_CREDIT_COST_DOLLARS', '0.1');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.mocked(chargeCredits).mockClear();
  });

  it('runs a combined enrichment for a known email and bills 0.2 credits', async () => {
    const calls = stubHunterFetch(() =>
      jsonResponse(200, { data: { person: PERSON, company: COMPANY } }),
    );

    const results = await enrichPeople([{ email: 'jane@acme.com' }], {
      deadline: FAR_DEADLINE(),
    });

    expect(calls).toHaveLength(1);
    expect(calls[0].url.pathname).toBe('/v2/combined/find');
    expect(calls[0].url.searchParams.get('email')).toBe('jane@acme.com');
    expect(calls[0].apiKey).toBe('secret-key');
    expect(results).toEqual([
      { outcome: 'matched', data: { person: PERSON, company: COMPANY } },
    ]);
    // 0.2 credits x $0.1 x 1.2 margin, billed as one call
    expect(chargeCredits).toHaveBeenCalledExactlyOnceWith({
      creditsUsedMicro: 24_000,
      operationType: 'CODE_EXECUTION',
      quantity: 1,
      resourceContext: 'hunter/person',
    });
  });

  it('does not bill a combined enrichment missing every core data set', async () => {
    stubHunterFetch(() =>
      jsonResponse(200, {
        data: { person: { email: 'jane@acme.com' }, company: { name: 'Acme' } },
      }),
    );

    await enrichPeople([{ email: 'jane@acme.com' }], {
      deadline: FAR_DEADLINE(),
    });

    expect(chargeCredits).not.toHaveBeenCalled();
  });

  it('finds a missing email, then enriches it', async () => {
    const calls = stubHunterFetch(({ url }) =>
      url.pathname === '/v2/email-finder'
        ? jsonResponse(200, {
            data: {
              email: 'jane@acme.com',
              score: 97,
              verification: { status: 'valid' },
            },
          })
        : jsonResponse(200, { data: { person: PERSON, company: COMPANY } }),
    );

    const [result] = await enrichPeople(
      [{ firstName: 'Jane', lastName: 'Doe', domain: 'acme.com' }],
      { deadline: FAR_DEADLINE() },
    );

    expect(Object.fromEntries(calls[0].url.searchParams)).toEqual({
      domain: 'acme.com',
      first_name: 'Jane',
      last_name: 'Doe',
    });
    expect(calls[1].url.searchParams.get('email')).toBe('jane@acme.com');
    expect(result).toMatchObject({
      outcome: 'matched',
      data: { emailFinder: { score: 97 }, person: PERSON },
    });
    // One credit for the email found plus 0.2 for the enrichment, over two calls
    expect(chargeCredits).toHaveBeenCalledWith(
      expect.objectContaining({ creditsUsedMicro: 144_000, quantity: 2 }),
    );
  });

  it('keeps a found email when the enrichment behind it fails', async () => {
    stubHunterFetch(({ url }) =>
      url.pathname === '/v2/email-finder'
        ? jsonResponse(200, {
            data: { email: 'jane@acme.com', verification: { status: 'valid' } },
          })
        : jsonResponse(500, { errors: [{ details: 'Server error' }] }),
    );

    const [result] = await enrichPeople(
      [{ firstName: 'Jane', lastName: 'Doe', domain: 'acme.com' }],
      { deadline: FAR_DEADLINE() },
    );

    expect(result).toEqual({
      outcome: 'matched',
      data: {
        emailFinder: {
          email: 'jane@acme.com',
          verification: { status: 'valid' },
        },
      },
    });
    expect(chargeCredits).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 1 }),
    );
  });

  it('uses the company name when the person has no company domain', async () => {
    const calls = stubHunterFetch(() => jsonResponse(404, { errors: [] }));

    await enrichPeople(
      [{ firstName: 'Jane', lastName: 'Doe', companyName: 'Acme' }],
      { deadline: FAR_DEADLINE() },
    );

    expect(calls[0].url.searchParams.get('company')).toBe('Acme');
    expect(calls[0].url.searchParams.has('domain')).toBe(false);
  });

  it('looks up a LinkedIn handle with email enrichment when the email finder is off', async () => {
    vi.stubEnv('HUNTER_FIND_MISSING_EMAILS', 'false');
    const calls = stubHunterFetch(() => jsonResponse(200, { data: PERSON }));

    const [result] = await enrichPeople([{ linkedinHandle: 'janedoe' }], {
      deadline: FAR_DEADLINE(),
    });

    expect(calls[0].url.pathname).toBe('/v2/people/find');
    expect(calls[0].url.searchParams.get('linkedin_handle')).toBe('janedoe');
    expect(result).toEqual({ outcome: 'matched', data: { person: PERSON } });
  });

  it.each([404, 451])(
    'records an HTTP %i as not found, free of charge',
    async (httpStatus) => {
      stubHunterFetch(() => jsonResponse(httpStatus, { errors: [] }));

      expect(
        await enrichPeople([{ email: 'jane@acme.com' }], {
          deadline: FAR_DEADLINE(),
        }),
      ).toEqual([{ outcome: 'not_found' }]);
      expect(chargeCredits).not.toHaveBeenCalled();
    },
  );

  it('retries a rate-limited call, which Hunter reports as HTTP 403', async () => {
    let attempts = 0;
    stubHunterFetch(() => {
      attempts++;

      return attempts === 1
        ? jsonResponse(403, {
            errors: [{ id: 'too_many_requests', details: 'Rate limit' }],
          })
        : jsonResponse(200, { data: { person: PERSON } });
    });

    const [result] = await enrichPeople([{ email: 'jane@acme.com' }], {
      deadline: FAR_DEADLINE(),
    });

    expect(attempts).toBe(2);
    expect(result).toMatchObject({ outcome: 'matched' });
  });

  it('reports the usage limit, which Hunter returns as HTTP 429', async () => {
    stubHunterFetch(() =>
      jsonResponse(429, {
        errors: [{ id: 'too_many_requests', details: 'Usage limit reached' }],
      }),
    );

    expect(
      await enrichPeople([{ email: 'jane@acme.com' }], {
        deadline: FAR_DEADLINE(),
      }),
    ).toEqual([
      { outcome: 'error', httpStatus: 429, message: 'Usage limit reached' },
    ]);
  });

  it('stops looking up records once the run is out of time', async () => {
    const calls = stubHunterFetch(() => jsonResponse(200, { data: {} }));

    expect(
      await enrichPeople([{ email: 'jane@acme.com' }], {
        deadline: Date.now() - 1,
      }),
    ).toEqual([
      { outcome: 'error', httpStatus: 0, message: HUNTER_TIME_LIMIT_MESSAGE },
    ]);
    expect(calls).toHaveLength(0);
  });

  it('fails before any call when the credit cost is not configured', async () => {
    vi.stubEnv('HUNTER_CREDIT_COST_DOLLARS', '');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      enrichPeople([{ email: 'jane@acme.com' }], { deadline: FAR_DEADLINE() }),
    ).rejects.toThrow('HUNTER_CREDIT_COST_DOLLARS is not set');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
