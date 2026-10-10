import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';

vi.mock('twenty-sdk/billing', () => ({
  chargeCredits: vi.fn(async () => undefined),
}));

const BUSINESS_ID = '8adce3ca1cef0c986b22310e369a0793';

const jsonResponse = (status: number, json: unknown) =>
  new Response(JSON.stringify(json), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('enrichCompanies', () => {
  beforeEach(() => {
    vi.stubEnv('EXPLORIUM_API_KEY', 'secret-key');
    vi.stubEnv('EXPLORIUM_CREDIT_COST_DOLLARS', '0.1');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('matches, then enriches firmographics for the matched businesses', async () => {
    const fetchMock = vi.fn(async (url: string, _init: RequestInit) =>
      url.endsWith('/businesses/match')
        ? jsonResponse(200, {
            total_results: 2,
            total_matches: 1,
            matched_businesses: [
              { input: {}, business_id: BUSINESS_ID },
              { input: {}, business_id: null },
            ],
          })
        : jsonResponse(200, {
            data: [{ business_id: BUSINESS_ID, data: { name: 'Acme Corp' } }],
            total_results: 1,
          }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const results = await enrichCompanies([
      { matchInput: { name: 'Acme', domain: 'acme.com' } },
      { matchInput: { domain: 'unknown.example' } },
    ]);

    const [, firmographicsInit] = fetchMock.mock.calls[1];
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://api.explorium.ai/v2/businesses/firmographics/enrich',
    );
    expect(JSON.parse(firmographicsInit.body as string)).toEqual({
      business_ids: [BUSINESS_ID],
    });
    expect(results).toEqual([
      {
        outcome: 'matched',
        data: { business_id: BUSINESS_ID, name: 'Acme Corp' },
      },
      { outcome: 'not_found' },
    ]);
  });

  it('reports a match error item as an error for that record only', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        url.endsWith('/businesses/match')
          ? jsonResponse(200, {
              total_results: 2,
              total_matches: 1,
              matched_businesses: [
                { input: {}, error: 'Invalid domain', error_type: 'input' },
                { input: {}, business_id: BUSINESS_ID },
              ],
            })
          : jsonResponse(200, {
              data: [{ business_id: BUSINESS_ID, data: { name: 'Acme Corp' } }],
              total_results: 1,
            }),
      ),
    );

    const results = await enrichCompanies([
      { matchInput: { domain: 'not a domain' } },
      { matchInput: { domain: 'acme.com' } },
    ]);

    expect(results[0]).toEqual({
      outcome: 'error',
      httpStatus: 200,
      message: 'Invalid domain',
    });
    expect(results[1]).toMatchObject({ outcome: 'matched' });
  });

  it('fails every record with the 422 validation message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse(422, {
          detail: [{ loc: ['body'], msg: 'field required', type: 'missing' }],
        }),
      ),
    );

    const results = await enrichCompanies([
      { matchInput: { domain: 'acme.com' } },
    ]);

    expect(results).toEqual([
      { outcome: 'error', httpStatus: 422, message: 'field required' },
    ]);
  });

  it('fails every record when the API key is missing', async () => {
    vi.stubEnv('EXPLORIUM_API_KEY', '');

    await expect(
      enrichCompanies([{ matchInput: { domain: 'acme.com' } }]),
    ).rejects.toThrow('EXPLORIUM_API_KEY is not set');
  });

  it('refuses to call Explorium when the credit cost is not configured', async () => {
    vi.stubEnv('EXPLORIUM_CREDIT_COST_DOLLARS', '');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      enrichCompanies([{ matchInput: { domain: 'acme.com' } }]),
    ).rejects.toThrow('EXPLORIUM_CREDIT_COST_DOLLARS is not set');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
