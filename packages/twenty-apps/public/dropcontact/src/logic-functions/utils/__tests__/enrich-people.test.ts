import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chargeCredits } from 'twenty-sdk/billing';

import { enrichPeople } from 'src/logic-functions/utils/enrich-people';
import { type DropcontactMatchParams } from 'src/types/dropcontact-match-params';

vi.mock('twenty-sdk/billing', () => ({
  chargeCredits: vi.fn(async () => undefined),
}));

vi.mock('src/logic-functions/utils/sleep', () => ({
  sleep: vi.fn(async () => undefined),
}));

type FetchCall = {
  url: string;
  method: string;
  body?: Record<string, unknown>;
};

const jsonResponse = (status: number, json: unknown) =>
  new Response(JSON.stringify(json), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const stubDropcontact = (respond: (call: FetchCall) => Response) => {
  const calls: FetchCall[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init: RequestInit) => {
      const call = {
        url,
        method: init.method ?? 'GET',
        body: typeof init.body === 'string' ? JSON.parse(init.body) : undefined,
      };
      calls.push(call);

      return respond(call);
    }),
  );

  return calls;
};

const buildParams = (
  recordId: string,
  overrides: Partial<DropcontactMatchParams> = {},
): DropcontactMatchParams => ({
  recordId,
  contact: {
    email: `${recordId}@acme.com`,
    custom_fields: { twenty_record_id: recordId },
  },
  ...overrides,
});

const readyResponse = (contacts: Record<string, unknown>[]) =>
  jsonResponse(200, { success: true, error: false, data: contacts });

const notReadyResponse = () =>
  jsonResponse(200, {
    success: false,
    error: false,
    reason: 'Request not ready yet, try again in 30 seconds',
  });

const FAR_DEADLINE = () => Date.now() + 60_000;

describe('enrichPeople', () => {
  beforeEach(() => {
    vi.stubEnv('DROPCONTACT_API_KEY', 'secret-token');
    vi.stubEnv('DROPCONTACT_CREDIT_COST_DOLLARS', '0.1');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.mocked(chargeCredits).mockClear();
  });

  it('submits the batch, polls until ready, and maps results by record id', async () => {
    let polls = 0;
    const calls = stubDropcontact(({ method }) => {
      if (method === 'POST') {
        return jsonResponse(200, { success: true, request_id: 'request-1' });
      }
      polls++;

      return polls === 1
        ? notReadyResponse()
        : readyResponse([
            {
              email: [{ email: 'p2@acme.com', qualification: 'invalid@pro' }],
              custom_fields: { twenty_record_id: 'p2' },
            },
            {
              email: [
                { email: 'p1@acme.com', qualification: 'nominative@pro' },
              ],
              job: 'CEO',
              custom_fields: { twenty_record_id: 'p1' },
            },
          ]);
    });

    const results = await enrichPeople(
      [buildParams('p1'), buildParams('p2'), buildParams('p3')],
      { deadline: FAR_DEADLINE() },
    );

    expect(calls[0]).toMatchObject({
      url: 'https://api.dropcontact.com/v1/enrich/all',
      method: 'POST',
      body: { siren: true, language: 'en' },
    });
    expect(calls[calls.length - 1].url).toBe(
      'https://api.dropcontact.com/v1/enrich/all/request-1',
    );
    expect(results[0]).toMatchObject({
      outcome: 'matched',
      data: { job: 'CEO' },
    });
    expect(results[1]).toMatchObject({ outcome: 'matched' });
    expect(results[2]).toEqual({ outcome: 'not_found' });
  });

  it('bills one credit per contact returned with a qualified email', async () => {
    stubDropcontact(({ method }) =>
      method === 'POST'
        ? jsonResponse(200, { success: true, request_id: 'request-1' })
        : readyResponse([
            {
              email: [
                { email: 'p1@acme.com', qualification: 'nominative@pro' },
              ],
              custom_fields: { twenty_record_id: 'p1' },
            },
            { custom_fields: { twenty_record_id: 'p2' } },
          ]),
    );

    await enrichPeople([buildParams('p1'), buildParams('p2')], {
      deadline: FAR_DEADLINE(),
    });

    expect(chargeCredits).toHaveBeenCalledExactlyOnceWith({
      creditsUsedMicro: 120_000,
      operationType: 'CODE_EXECUTION',
      quantity: 1,
      resourceContext: 'dropcontact/person',
    });
  });

  it('bills only the contacts collected in this run from a stored batch', async () => {
    stubDropcontact(() =>
      readyResponse([
        {
          email: [{ email: 'p1@acme.com', qualification: 'nominative@pro' }],
          custom_fields: { twenty_record_id: 'p1' },
        },
        {
          email: [{ email: 'p2@acme.com', qualification: 'nominative@pro' }],
          custom_fields: { twenty_record_id: 'p2' },
        },
      ]),
    );

    await enrichPeople([buildParams('p1', { pendingRequestId: 'request-0' })], {
      deadline: FAR_DEADLINE(),
    });

    expect(chargeCredits).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ quantity: 1 }),
    );
  });

  it('reports a batch Dropcontact failed instead of waiting on it', async () => {
    stubDropcontact(({ method }) =>
      method === 'POST'
        ? jsonResponse(200, { success: true, request_id: 'request-1' })
        : jsonResponse(200, {
            success: false,
            error: true,
            reason: 'Invalid request id',
          }),
    );

    expect(
      await enrichPeople([buildParams('p1')], { deadline: FAR_DEADLINE() }),
    ).toEqual([
      { outcome: 'error', httpStatus: 200, message: 'Invalid request id' },
    ]);
  });

  it('returns pending with the request id when the poll budget runs out', async () => {
    stubDropcontact(({ method }) =>
      method === 'POST'
        ? jsonResponse(200, { success: true, request_id: 'request-1' })
        : notReadyResponse(),
    );

    const results = await enrichPeople([buildParams('p1')], {
      deadline: Date.now(),
    });

    expect(results).toEqual([{ outcome: 'pending', requestId: 'request-1' }]);
    expect(chargeCredits).not.toHaveBeenCalled();
  });

  it('collects a stored batch without resubmitting it', async () => {
    const calls = stubDropcontact(() =>
      readyResponse([
        {
          email: [{ email: 'p1@acme.com', qualification: 'nominative@pro' }],
          custom_fields: { twenty_record_id: 'p1' },
        },
      ]),
    );

    const results = await enrichPeople(
      [buildParams('p1', { pendingRequestId: 'request-0' })],
      { deadline: FAR_DEADLINE() },
    );

    expect(calls.every((call) => call.method === 'GET')).toBe(true);
    expect(results[0]).toMatchObject({ outcome: 'matched' });
  });

  it('resubmits contacts whose stored batch Dropcontact no longer has', async () => {
    const calls = stubDropcontact(({ method, url }) => {
      if (url.endsWith('/request-0')) {
        return jsonResponse(404, { error: true, reason: 'Not found' });
      }

      return method === 'POST'
        ? jsonResponse(200, { success: true, request_id: 'request-1' })
        : readyResponse([{ custom_fields: { twenty_record_id: 'p1' } }]);
    });

    const results = await enrichPeople(
      [buildParams('p1', { pendingRequestId: 'request-0' })],
      { deadline: FAR_DEADLINE() },
    );

    expect(calls.filter((call) => call.method === 'POST')).toHaveLength(1);
    expect(results).toEqual([{ outcome: 'not_found' }]);
  });

  it('fails every submitted record with the Dropcontact reason', async () => {
    stubDropcontact(() =>
      jsonResponse(403, {
        error: true,
        reason: 'API call Token exceeded quota.',
      }),
    );

    expect(
      await enrichPeople([buildParams('p1')], { deadline: FAR_DEADLINE() }),
    ).toEqual([
      {
        outcome: 'error',
        httpStatus: 403,
        message: 'API call Token exceeded quota.',
      },
    ]);
  });

  it('sends siren=false when French registry data is turned off', async () => {
    vi.stubEnv('DROPCONTACT_FRENCH_REGISTRY', 'false');
    const calls = stubDropcontact(({ method }) =>
      method === 'POST'
        ? jsonResponse(200, { success: true, request_id: 'request-1' })
        : readyResponse([]),
    );

    await enrichPeople([buildParams('p1')], { deadline: FAR_DEADLINE() });

    expect(calls[0].body).toMatchObject({ siren: false });
  });

  it('refuses to call Dropcontact when the credit cost is not configured', async () => {
    vi.stubEnv('DROPCONTACT_CREDIT_COST_DOLLARS', '');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      enrichPeople([buildParams('p1')], { deadline: FAR_DEADLINE() }),
    ).rejects.toThrow('DROPCONTACT_CREDIT_COST_DOLLARS is not set');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
