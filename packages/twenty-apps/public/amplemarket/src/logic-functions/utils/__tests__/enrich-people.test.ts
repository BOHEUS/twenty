import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chargeCredits } from 'twenty-sdk/billing';

import { AMPLEMARKET_TIME_LIMIT_MESSAGE } from 'src/constants/amplemarket-time-limit-message';
import {
  errorResponse,
  jsonResponse,
  stubAmplemarketFetch,
} from 'src/logic-functions/__mocks__/amplemarket-fetch-stub';
import { enrichPeople } from 'src/logic-functions/utils/enrich-people';

vi.mock('twenty-sdk/billing', () => ({
  chargeCredits: vi.fn(async () => undefined),
}));

vi.mock('src/logic-functions/utils/wait-for-amplemarket-rate-limit', () => ({
  waitForAmplemarketRateLimit: vi.fn(async () => undefined),
}));

vi.mock('src/logic-functions/utils/sleep', () => ({
  sleep: vi.fn(async () => undefined),
}));

const FAR_DEADLINE = () => Date.now() + 60_000;

const PERSON = {
  id: 'person-1',
  first_name: 'Jane',
  last_name: 'Doe',
  email: 'jane@acme.com',
  title: 'CEO',
  phone_numbers: [
    {
      id: 'phone-1',
      number: '+15125550100',
      type: 'mobile',
      is_wrong_number: false,
    },
  ],
};

describe('enrichPeople', () => {
  beforeEach(() => {
    vi.stubEnv('AMPLEMARKET_API_KEY', 'secret-key');
    vi.stubEnv('AMPLEMARKET_EMAIL_CREDIT_COST_DOLLARS', '0.1');
    vi.stubEnv('AMPLEMARKET_PHONE_CREDIT_COST_DOLLARS', '0.5');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.mocked(chargeCredits).mockClear();
  });

  it('finds a person by email with a bearer token and bills half an email credit', async () => {
    const calls = stubAmplemarketFetch(() => jsonResponse(200, PERSON));

    const results = await enrichPeople(
      [{ email: 'jane@acme.com', hasPhone: true }],
      { deadline: FAR_DEADLINE() },
    );

    expect(calls[0].url.pathname).toBe('/people/find');
    expect(Object.fromEntries(calls[0].url.searchParams)).toEqual({
      email: 'jane@acme.com',
    });
    expect(calls[0].authorization).toBe('Bearer secret-key');
    expect(results).toEqual([{ outcome: 'matched', data: PERSON }]);
    // 0.5 email credits x $0.1 x 1.2 margin
    expect(chargeCredits).toHaveBeenCalledExactlyOnceWith({
      creditsUsedMicro: 60_000,
      operationType: 'CODE_EXECUTION',
      quantity: 1,
      resourceContext: 'amplemarket/person',
    });
  });

  it('reveals the missing email and phones when both are selected', async () => {
    vi.stubEnv('AMPLEMARKET_CONTACT_DETAILS', '["email","phone"]');
    const calls = stubAmplemarketFetch(() => jsonResponse(200, PERSON));

    await enrichPeople(
      [
        {
          name: 'Jane Doe',
          companyDomain: 'acme.com',
          companyName: 'Acme',
          hasPhone: false,
        },
      ],
      { deadline: FAR_DEADLINE() },
    );

    expect(Object.fromEntries(calls[0].url.searchParams)).toEqual({
      name: 'Jane Doe',
      company_domain: 'acme.com',
      reveal_email: 'true',
      reveal_phone_numbers: 'true',
    });
    // 1.5 email credits x $0.1 plus 1 phone credit x $0.5, with the 1.2 margin
    expect(chargeCredits).toHaveBeenCalledWith(
      expect.objectContaining({ creditsUsedMicro: 780_000, quantity: 1 }),
    );
  });

  it('does not ask to reveal contact details the record already has', async () => {
    vi.stubEnv('AMPLEMARKET_CONTACT_DETAILS', '["email","phone"]');
    const calls = stubAmplemarketFetch(() => jsonResponse(200, PERSON));

    await enrichPeople([{ email: 'jane@acme.com', hasPhone: true }], {
      deadline: FAR_DEADLINE(),
    });

    expect(calls[0].url.searchParams.has('reveal_email')).toBe(false);
    expect(calls[0].url.searchParams.has('reveal_phone_numbers')).toBe(false);
  });

  it.each([404, 451])(
    'records an HTTP %i as not found, free of charge',
    async (httpStatus) => {
      stubAmplemarketFetch(() =>
        errorResponse(httpStatus, 'person_not_found', 'Not found'),
      );

      expect(
        await enrichPeople([{ email: 'jane@acme.com', hasPhone: true }], {
          deadline: FAR_DEADLINE(),
        }),
      ).toEqual([{ outcome: 'not_found' }]);
      expect(chargeCredits).not.toHaveBeenCalled();
    },
  );

  it('retries a rate-limited request', async () => {
    let attempts = 0;
    stubAmplemarketFetch(() => {
      attempts++;

      return attempts === 1
        ? errorResponse(429, 'rate_limited', 'Try again later')
        : jsonResponse(200, PERSON);
    });

    const [result] = await enrichPeople(
      [{ email: 'jane@acme.com', hasPhone: true }],
      { deadline: FAR_DEADLINE() },
    );

    expect(attempts).toBe(2);
    expect(result).toMatchObject({ outcome: 'matched' });
  });

  it('does not retry a rate-limited request past the run deadline', async () => {
    let attempts = 0;
    stubAmplemarketFetch(() => {
      attempts++;

      return errorResponse(429, 'rate_limited', 'Try again later');
    });

    const [result] = await enrichPeople(
      [{ email: 'jane@acme.com', hasPhone: true }],
      { deadline: Date.now() + 1_000 },
    );

    expect(attempts).toBe(1);
    expect(result).toMatchObject({ outcome: 'error', httpStatus: 429 });
  });

  it('stops calling Amplemarket after an account error', async () => {
    const calls = stubAmplemarketFetch(() =>
      errorResponse(401, 'unauthorized', 'Invalid API key'),
    );

    const results = await enrichPeople(
      [
        { email: 'jane@acme.com', hasPhone: true },
        { email: 'john@acme.com', hasPhone: true },
      ],
      { deadline: FAR_DEADLINE() },
    );

    expect(calls).toHaveLength(1);
    expect(results).toEqual([
      { outcome: 'error', httpStatus: 401, message: 'Invalid API key' },
      { outcome: 'error', httpStatus: 401, message: 'Invalid API key' },
    ]);
  });

  it('keeps the results when charging credits fails', async () => {
    stubAmplemarketFetch(() => jsonResponse(200, PERSON));
    vi.mocked(chargeCredits).mockRejectedValueOnce(
      new Error('Not enough credits'),
    );
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    expect(
      await enrichPeople([{ email: 'jane@acme.com', hasPhone: true }], {
        deadline: FAR_DEADLINE(),
      }),
    ).toEqual([{ outcome: 'matched', data: PERSON }]);
    expect(consoleErrorSpy).toHaveBeenCalledOnce();

    consoleErrorSpy.mockRestore();
  });

  it('reports a lack of credits with the Amplemarket detail', async () => {
    stubAmplemarketFetch(() =>
      errorResponse(
        402,
        'insufficient_credits',
        'You do not have enough credits to perform this operation.',
      ),
    );

    expect(
      await enrichPeople([{ email: 'jane@acme.com', hasPhone: true }], {
        deadline: FAR_DEADLINE(),
      }),
    ).toEqual([
      {
        outcome: 'error',
        httpStatus: 402,
        message: 'You do not have enough credits to perform this operation.',
      },
    ]);
  });

  it('stops looking up records once the run is out of time', async () => {
    const calls = stubAmplemarketFetch(() => jsonResponse(200, PERSON));

    expect(
      await enrichPeople([{ email: 'jane@acme.com', hasPhone: true }], {
        deadline: Date.now() - 1,
      }),
    ).toEqual([
      {
        outcome: 'error',
        httpStatus: 0,
        message: AMPLEMARKET_TIME_LIMIT_MESSAGE,
      },
    ]);
    expect(calls).toHaveLength(0);
  });

  it('fails before any call when a credit cost is not configured', async () => {
    vi.stubEnv('AMPLEMARKET_PHONE_CREDIT_COST_DOLLARS', '');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      enrichPeople([{ email: 'jane@acme.com', hasPhone: true }], {
        deadline: FAR_DEADLINE(),
      }),
    ).rejects.toThrow('AMPLEMARKET_PHONE_CREDIT_COST_DOLLARS is not set');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
