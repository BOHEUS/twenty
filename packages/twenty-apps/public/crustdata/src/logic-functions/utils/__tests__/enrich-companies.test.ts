import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { enrichCompanies } from 'src/logic-functions/utils/enrich-companies';

const matchBody = (matchedOn: string, crustdataCompanyId: number) => ({
  matched_on: matchedOn,
  match_status: 'matched',
  matches: [
    {
      confidence_score: 1,
      company_data: { crustdata_company_id: crustdataCompanyId },
    },
  ],
});

const jsonResponse = (body: unknown, creditsUsed = '2') =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'x-credits-used': creditsUsed },
  });

beforeEach(() => {
  process.env.CRUSTDATA_API_KEY = 'test-key';
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.CRUSTDATA_API_KEY;
});

describe('enrichCompanies', () => {
  it('sends one request per identifier type and keeps the caller order', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse([
          matchBody('analyticalengines.com', 9911),
          matchBody('differenceengine.com', 9912),
        ]),
      )
      .mockResolvedValueOnce(jsonResponse([matchBody('Punchcard Inc', 9913)]));
    vi.stubGlobal('fetch', fetchMock);

    const { results, creditsUsed } = await enrichCompanies([
      { identifierType: 'domains', identifier: 'analyticalengines.com' },
      { identifierType: 'names', identifier: 'Punchcard Inc' },
      { identifierType: 'domains', identifier: 'differenceengine.com' },
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(2);

    const firstBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(firstBody.domains).toEqual([
      'analyticalengines.com',
      'differenceengine.com',
    ]);
    expect(firstBody.names).toBeUndefined();
    expect(firstBody.fields).toContain('funding');

    expect(
      results.map((result) =>
        result.outcome === 'matched'
          ? result.data.crustdata_company_id
          : result.outcome,
      ),
    ).toEqual([9911, 9913, 9912]);
    expect(creditsUsed).toBe(4);
  });

  it('sends Crustdata ids as integers', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse([matchBody('9911', 9911)]));
    vi.stubGlobal('fetch', fetchMock);

    await enrichCompanies([
      { identifierType: 'crustdata_company_ids', identifier: '9911' },
    ]);

    expect(
      JSON.parse(fetchMock.mock.calls[0][1].body).crustdata_company_ids,
    ).toEqual([9911]);
  });

  it('fails only the identifier type whose request failed', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse([matchBody('analyticalengines.com', 9911)]),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: { message: 'No data found' } }), {
          status: 404,
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    const { results } = await enrichCompanies([
      { identifierType: 'domains', identifier: 'analyticalengines.com' },
      { identifierType: 'names', identifier: 'Punchcard Inc' },
    ]);

    expect(results[0]).toMatchObject({ outcome: 'matched' });
    expect(results[1]).toMatchObject({ outcome: 'error', httpStatus: 404 });
  });

  it('returns nothing for an empty batch without calling the API', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    expect(await enrichCompanies([])).toEqual({ results: [], creditsUsed: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
