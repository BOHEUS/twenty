import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chargeCredits } from 'twenty-sdk/billing';

import { enrichPeople } from 'src/logic-functions/utils/enrich-people';

vi.mock('twenty-sdk/billing', () => ({
  chargeCredits: vi.fn(async () => undefined),
}));

const PROSPECT_ID = 'ee936e451b50c70e068e1b54e106cb89173198c4';
const STORED_PROSPECT_ID = 'aa936e451b50c70e068e1b54e106cb89173198c4';

type FetchCall = {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
};

const jsonResponse = (
  status: number,
  json: unknown,
  headers: Record<string, string> = {},
) =>
  new Response(JSON.stringify(json), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

const stubExplorium = (respond: (call: FetchCall) => Response): FetchCall[] => {
  const calls: FetchCall[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init: RequestInit) => {
      const call = {
        url,
        headers: init.headers as Record<string, string>,
        body: JSON.parse(init.body as string),
      };
      calls.push(call);

      return respond(call);
    }),
  );

  return calls;
};

const matchResponse = (prospectIds: (string | null)[], totalCredits = 0) =>
  jsonResponse(200, {
    response_context: { request_status: 'success' },
    total_results: prospectIds.length,
    total_matches: prospectIds.filter(Boolean).length,
    matched_prospects: prospectIds.map((prospectId) => ({
      input: {},
      prospect_id: prospectId,
    })),
    credit_usage: { total_credits: totalCredits, total_results: 0 },
  });

const rowsResponse = (
  rows: { prospect_id: string; data: Record<string, unknown> }[],
  totalCredits: number,
) =>
  jsonResponse(200, {
    response_context: { request_status: 'success' },
    data: rows,
    total_results: rows.length,
    credit_usage: { total_credits: totalCredits, total_results: rows.length },
  });

describe('enrichPeople', () => {
  beforeEach(() => {
    vi.stubEnv('EXPLORIUM_API_KEY', 'secret-key');
    vi.stubEnv('EXPLORIUM_CREDIT_COST_DOLLARS', '0.1');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.mocked(chargeCredits).mockClear();
  });

  it('matches, then enriches the profile and the professional email by default', async () => {
    const calls = stubExplorium(({ url }) => {
      if (url.endsWith('/prospects/match')) {
        return matchResponse([PROSPECT_ID]);
      }
      if (url.endsWith('/prospects/profiles/enrich')) {
        return rowsResponse(
          [
            {
              prospect_id: PROSPECT_ID,
              data: { first_name: 'jane', job_title: 'CEO' },
            },
          ],
          2,
        );
      }

      return rowsResponse(
        [
          {
            prospect_id: PROSPECT_ID,
            data: { professional_email: 'jane@acme.com' },
          },
        ],
        2,
      );
    });

    const results = await enrichPeople([
      { matchInput: { email: 'jane@acme.com' } },
    ]);

    expect(calls.map((call) => call.url)).toEqual([
      'https://api.explorium.ai/v2/prospects/match',
      'https://api.explorium.ai/v2/prospects/profiles/enrich',
      'https://api.explorium.ai/v2/prospects/contact_information/enrich',
    ]);
    expect(calls[0].headers).toMatchObject({
      api_key: 'secret-key',
      'credit-usage': 'true',
    });
    expect(calls[0].body).toEqual({
      prospects_to_match: [{ email: 'jane@acme.com' }],
    });
    expect(calls[1].body).toEqual({ prospect_ids: [PROSPECT_ID] });
    expect(calls[2].body).toEqual({
      prospect_ids: [PROSPECT_ID],
      parameters: { contact_types: ['email'] },
    });
    expect(results).toEqual([
      {
        outcome: 'matched',
        data: {
          prospect_id: PROSPECT_ID,
          first_name: 'jane',
          job_title: 'CEO',
          professional_email: 'jane@acme.com',
        },
      },
    ]);
  });

  it('reuses a stored prospect id without calling match', async () => {
    const calls = stubExplorium(() =>
      rowsResponse(
        [{ prospect_id: STORED_PROSPECT_ID, data: { job_title: 'CTO' } }],
        1,
      ),
    );

    const results = await enrichPeople([{ exploriumId: STORED_PROSPECT_ID }]);

    expect(calls.some((call) => call.url.endsWith('/prospects/match'))).toBe(
      false,
    );
    expect(results[0]).toMatchObject({ outcome: 'matched' });
  });

  it('keeps results aligned with the input when some records do not match', async () => {
    stubExplorium(({ url, body }) => {
      if (url.endsWith('/prospects/match')) {
        return matchResponse([null, PROSPECT_ID]);
      }

      const ids = body.prospect_ids as string[];

      return rowsResponse(
        ids.map((prospectId) => ({
          prospect_id: prospectId,
          data: { job_title: prospectId },
        })),
        ids.length,
      );
    });

    const results = await enrichPeople([
      { matchInput: { email: 'nobody@acme.com' } },
      { exploriumId: STORED_PROSPECT_ID },
      { matchInput: { email: 'jane@acme.com' } },
    ]);

    expect(results.map((result) => result.outcome)).toEqual([
      'not_found',
      'matched',
      'matched',
    ]);
    expect(results[1]).toMatchObject({
      data: { job_title: STORED_PROSPECT_ID },
    });
    expect(results[2]).toMatchObject({ data: { job_title: PROSPECT_ID } });
  });

  it('asks for the contact details selected in the app settings', async () => {
    vi.stubEnv('EXPLORIUM_CONTACT_DETAILS', '["email","phone"]');
    const calls = stubExplorium(() =>
      rowsResponse(
        [{ prospect_id: STORED_PROSPECT_ID, data: { job_title: 'CTO' } }],
        0,
      ),
    );

    await enrichPeople([{ exploriumId: STORED_PROSPECT_ID }]);

    expect(calls[1].body.parameters).toEqual({
      contact_types: ['email', 'phone'],
    });
  });

  it('skips the contact call when no contact detail is selected', async () => {
    vi.stubEnv('EXPLORIUM_CONTACT_DETAILS', '');
    const calls = stubExplorium(() =>
      rowsResponse(
        [{ prospect_id: STORED_PROSPECT_ID, data: { job_title: 'CTO' } }],
        0,
      ),
    );

    await enrichPeople([{ exploriumId: STORED_PROSPECT_ID }]);

    expect(calls).toHaveLength(1);
  });

  it('bills the credits every call reports', async () => {
    stubExplorium(({ url }) =>
      url.endsWith('/prospects/match')
        ? matchResponse([PROSPECT_ID], 1)
        : rowsResponse(
            [{ prospect_id: PROSPECT_ID, data: { job_title: 'CEO' } }],
            2,
          ),
    );

    await enrichPeople([{ matchInput: { email: 'jane@acme.com' } }]);

    expect(
      vi.mocked(chargeCredits).mock.calls.map(([charge]) => charge),
    ).toEqual([
      expect.objectContaining({
        quantity: 1,
        creditsUsedMicro: 120_000,
        resourceContext: 'explorium/person',
      }),
      expect.objectContaining({ quantity: 2, creditsUsedMicro: 240_000 }),
      expect.objectContaining({ quantity: 2, creditsUsedMicro: 240_000 }),
    ]);
  });

  it('reports every matched record as an error when the profile call fails', async () => {
    stubExplorium(({ url }) =>
      url.endsWith('/prospects/match')
        ? matchResponse([PROSPECT_ID])
        : jsonResponse(403, {
            details: 'You have insufficient credits to perform this operation.',
          }),
    );

    const results = await enrichPeople([
      { matchInput: { email: 'jane@acme.com' } },
    ]);

    expect(results).toEqual([
      {
        outcome: 'error',
        httpStatus: 403,
        message: 'You have insufficient credits to perform this operation.',
      },
    ]);
    expect(chargeCredits).not.toHaveBeenCalled();
  });

  it('retries a rate-limited call after Retry-After', async () => {
    vi.useFakeTimers();
    let matchAttempts = 0;
    stubExplorium(({ url }) => {
      if (url.endsWith('/prospects/match')) {
        matchAttempts++;

        return matchAttempts === 1
          ? jsonResponse(
              429,
              { error: 'rate_limit_exceeded' },
              { 'Retry-After': '1' },
            )
          : matchResponse([null]);
      }

      return rowsResponse([], 0);
    });

    const resultsPromise = enrichPeople([
      { matchInput: { email: 'jane@acme.com' } },
    ]);
    await vi.advanceTimersByTimeAsync(1_000);

    expect(await resultsPromise).toEqual([{ outcome: 'not_found' }]);
    expect(matchAttempts).toBe(2);
    vi.useRealTimers();
  });
});
