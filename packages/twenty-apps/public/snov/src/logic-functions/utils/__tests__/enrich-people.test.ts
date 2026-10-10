import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chargeCredits } from 'twenty-sdk/billing';

import { SNOV_TIME_LIMIT_MESSAGE } from 'src/constants/snov-time-limit-message';
import {
  jsonResponse,
  stubSnovFetch,
} from 'src/logic-functions/__mocks__/snov-fetch-stub';
import { enrichPeople } from 'src/logic-functions/utils/enrich-people';
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

const FAR_DEADLINE = () => Date.now() + 60_000;

const PROFILE = {
  success: true,
  id: 42,
  firstName: 'Jane',
  lastName: 'Doe',
  country: 'United States',
  locality: 'Austin',
  social: [{ type: 'linkedIn', link: 'https://www.linkedin.com/in/janedoe' }],
  currentJobs: [
    { companyName: 'Acme', position: 'CEO', site: 'https://acme.com' },
  ],
};

describe('enrichPeople', () => {
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

  it('looks up the profile behind a known email, sending the token as v1 expects', async () => {
    const calls = stubSnovFetch(() => jsonResponse(200, PROFILE));

    const results = await enrichPeople([{ email: 'jane@acme.com' }], {
      deadline: FAR_DEADLINE(),
    });

    expect(calls[0]).toMatchObject({
      url: 'https://api.snov.io/v1/oauth/access_token',
      method: 'POST',
    });
    expect(calls[0].body).toContain('grant_type=client_credentials');
    expect(calls[1]).toMatchObject({
      url: 'https://api.snov.io/v1/get-profile-by-email',
      authorization: 'Bearer token-1',
      body: 'email=jane%40acme.com&access_token=token-1',
    });
    expect(results).toEqual([
      { outcome: 'matched', data: { emailProfile: PROFILE } },
    ]);
    expect(chargeCredits).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 1, resourceContext: 'snov/person' }),
    );
  });

  it('finds a missing email from the name and domain, then looks up its profile', async () => {
    let finderPolls = 0;
    const calls = stubSnovFetch(({ url }) => {
      if (url.endsWith('/v2/emails-by-domain-by-name/start')) {
        return jsonResponse(200, { data: { task_hash: 'hash-1' } });
      }
      if (url.includes('/v2/emails-by-domain-by-name/result')) {
        finderPolls++;

        return finderPolls === 1
          ? jsonResponse(200, { status: 'in_progress', data: [] })
          : jsonResponse(200, {
              status: 'completed',
              data: [
                {
                  people: 'Jane Doe',
                  result: [
                    { email: 'j.doe@acme.com', smtp_status: 'unknown' },
                    { email: 'jane@acme.com', smtp_status: 'valid' },
                  ],
                },
              ],
            });
      }

      return jsonResponse(200, PROFILE);
    });

    const [result] = await enrichPeople(
      [{ firstName: 'Jane', lastName: 'Doe', domain: 'acme.com' }],
      { deadline: FAR_DEADLINE() },
    );

    const startCall = calls.find((call) =>
      call.url.endsWith('/v2/emails-by-domain-by-name/start'),
    );
    expect(JSON.parse(startCall?.body ?? '{}')).toEqual({
      rows: [{ first_name: 'Jane', last_name: 'Doe', domain: 'acme.com' }],
    });
    expect(result).toMatchObject({
      outcome: 'matched',
      data: {
        email: 'jane@acme.com',
        emailCheck: { smtp_status: 'valid' },
        emailProfile: { firstName: 'Jane' },
      },
    });
    // Two emails with a valid or unknown status plus one profile
    expect(chargeCredits).toHaveBeenCalledWith(
      expect.objectContaining({ quantity: 3 }),
    );
  });

  it('skips the email finder when it is turned off and falls back to LinkedIn', async () => {
    vi.stubEnv('SNOV_FIND_MISSING_EMAILS', 'false');
    const calls = stubSnovFetch(({ url }) =>
      url.endsWith('/v2/li-profiles-by-urls/start')
        ? jsonResponse(200, { data: { task_hash: 'hash-2' } })
        : jsonResponse(200, {
            status: 'completed',
            data: [
              {
                url: 'https://www.linkedin.com/in/janedoe/',
                result: { first_name: 'Jane', skills: ['Sales'] },
              },
            ],
          }),
    );

    const [result] = await enrichPeople(
      [
        {
          firstName: 'Jane',
          lastName: 'Doe',
          domain: 'acme.com',
          linkedinUrl: 'https://linkedin.com/in/janedoe',
        },
      ],
      { deadline: FAR_DEADLINE() },
    );

    expect(
      calls.some((call) => call.url.includes('emails-by-domain-by-name')),
    ).toBe(false);
    expect(
      calls.find((call) => call.url.endsWith('/v2/li-profiles-by-urls/start'))
        ?.body,
    ).toBe('urls%5B%5D=https%3A%2F%2Flinkedin.com%2Fin%2Fjanedoe');
    expect(result).toMatchObject({
      outcome: 'matched',
      data: { linkedinProfile: { skills: ['Sales'] } },
    });
  });

  it('matches found emails to people by name when Snov.io leaves a row out', async () => {
    stubSnovFetch(({ url }) => {
      if (url.endsWith('/v2/emails-by-domain-by-name/start')) {
        return jsonResponse(200, { data: { task_hash: 'hash-1' } });
      }
      if (url.includes('/v2/emails-by-domain-by-name/result')) {
        return jsonResponse(200, {
          status: 'completed',
          data: [
            {
              people: 'John Smith',
              result: [{ email: 'john@acme.com', smtp_status: 'valid' }],
            },
          ],
        });
      }

      return jsonResponse(200, { success: false });
    });

    const results = await enrichPeople(
      [
        { firstName: 'Jane', lastName: 'Doe', domain: 'acme.com' },
        { firstName: 'John', lastName: 'Smith', domain: 'acme.com' },
      ],
      { deadline: FAR_DEADLINE() },
    );

    expect(results[0]).toEqual({ outcome: 'not_found' });
    expect(results[1]).toMatchObject({
      outcome: 'matched',
      data: { email: 'john@acme.com' },
    });
  });

  it('falls back to LinkedIn when the email has no Snov.io profile', async () => {
    const calls = stubSnovFetch(({ url }) => {
      if (url.endsWith('/v1/get-profile-by-email')) {
        return jsonResponse(200, { success: false });
      }

      return url.endsWith('/v2/li-profiles-by-urls/start')
        ? jsonResponse(200, { data: { task_hash: 'hash-2' } })
        : jsonResponse(200, {
            status: 'completed',
            data: [
              {
                url: 'https://linkedin.com/in/janedoe',
                result: { first_name: 'Jane' },
              },
            ],
          });
    });

    const [result] = await enrichPeople(
      [
        {
          email: 'jane@acme.com',
          linkedinUrl: 'https://linkedin.com/in/janedoe',
        },
      ],
      { deadline: FAR_DEADLINE() },
    );

    expect(
      calls.some((call) => call.url.endsWith('/v2/li-profiles-by-urls/start')),
    ).toBe(true);
    expect(result).toMatchObject({
      outcome: 'matched',
      data: { linkedinProfile: { first_name: 'Jane' } },
    });
  });

  it('does not start an email finder task once the run is out of time', async () => {
    const calls = stubSnovFetch(() => jsonResponse(200, {}));

    expect(
      await enrichPeople(
        [{ firstName: 'Jane', lastName: 'Doe', domain: 'acme.com' }],
        { deadline: Date.now() - 1 },
      ),
    ).toEqual([
      { outcome: 'error', httpStatus: 0, message: SNOV_TIME_LIMIT_MESSAGE },
    ]);
    expect(calls).toHaveLength(0);
  });

  it('records a person Snov.io knows nothing about as not found, free of charge', async () => {
    stubSnovFetch(() => jsonResponse(200, { success: false }));

    expect(
      await enrichPeople([{ email: 'nobody@acme.com' }], {
        deadline: FAR_DEADLINE(),
      }),
    ).toEqual([{ outcome: 'not_found' }]);
    expect(chargeCredits).not.toHaveBeenCalled();
  });

  it('reports a lack of credits from the email finder as an account error', async () => {
    stubSnovFetch(({ url }) =>
      url.endsWith('/start')
        ? jsonResponse(200, { data: { task_hash: 'hash-1' } })
        : jsonResponse(200, { status: 'not_enough_credits' }),
    );

    expect(
      await enrichPeople(
        [{ firstName: 'Jane', lastName: 'Doe', domain: 'acme.com' }],
        { deadline: FAR_DEADLINE() },
      ),
    ).toEqual([
      {
        outcome: 'error',
        httpStatus: 403,
        message: 'The Snov.io account does not have enough credits.',
      },
    ]);
  });

  it('stops looking up records once the run is out of time', async () => {
    const calls = stubSnovFetch(() => jsonResponse(200, PROFILE));

    expect(
      await enrichPeople([{ email: 'jane@acme.com' }], {
        deadline: Date.now() - 1,
      }),
    ).toEqual([
      { outcome: 'error', httpStatus: 0, message: SNOV_TIME_LIMIT_MESSAGE },
    ]);
    expect(calls).toHaveLength(0);
  });

  it('fails before any call when the credentials are missing', async () => {
    vi.stubEnv('SNOV_CLIENT_SECRET', '');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      enrichPeople([{ email: 'jane@acme.com' }], { deadline: FAR_DEADLINE() }),
    ).rejects.toThrow('SNOV_CLIENT_SECRET must be set');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
