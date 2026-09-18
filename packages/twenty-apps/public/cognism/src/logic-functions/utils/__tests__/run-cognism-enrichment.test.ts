import { beforeEach, describe, expect, it, vi } from 'vitest';

import { postCognismRedeem } from 'src/logic-functions/utils/post-cognism-redeem';
import { postCognismRequest } from 'src/logic-functions/utils/post-cognism-request';
import { runCognismEnrichment } from 'src/logic-functions/utils/run-cognism-enrichment';

vi.mock('src/logic-functions/utils/post-cognism-request', () => ({
  postCognismRequest: vi.fn(),
}));
vi.mock('src/logic-functions/utils/post-cognism-redeem', () => ({
  postCognismRedeem: vi.fn(),
}));

const postCognismRequestMock = vi.mocked(postCognismRequest);
const postCognismRedeemMock = vi.mocked(postCognismRedeem);

type Contact = { id: string };

const PATHS = {
  enrichPath: '/contact/enrich',
  redeemPath: '/contact/redeem',
  collectionKey: 'contacts',
};

const enrichReturns = (items: unknown[], httpStatus = 200) => {
  postCognismRequestMock.mockResolvedValue({
    ok: true,
    httpStatus,
    json: { results: items },
  });
};

const redeemReturns = (entries: [string, Contact][]) => {
  postCognismRedeemMock.mockResolvedValue({
    ok: true,
    dataByRedeemId: new Map(entries),
  });
};

describe('runCognismEnrichment', () => {
  beforeEach(() => {
    postCognismRequestMock.mockReset();
    postCognismRedeemMock.mockReset();
  });

  it('returns no results and calls nothing for an empty request list', async () => {
    expect(await runCognismEnrichment({ ...PATHS, requests: [] })).toEqual([]);
    expect(postCognismRequestMock).not.toHaveBeenCalled();
  });

  it('enriches, then redeems only the matched records', async () => {
    enrichReturns([
      { redeemId: 'r1', matchScore: 92 },
      null,
      { redeemId: 'r3', matchScore: 71 },
    ]);
    redeemReturns([
      ['r1', { id: 'c1' }],
      ['r3', { id: 'c3' }],
    ]);

    const results = await runCognismEnrichment<Contact>({
      ...PATHS,
      requests: [
        { criteria: { email: 'a@acme.com' } },
        { criteria: { email: 'b@acme.com' } },
        { criteria: { email: 'c@acme.com' } },
      ],
    });

    expect(postCognismRequestMock).toHaveBeenCalledExactlyOnceWith({
      path: '/contact/enrich',
      body: {
        contacts: [
          { email: 'a@acme.com' },
          { email: 'b@acme.com' },
          { email: 'c@acme.com' },
        ],
      },
    });
    expect(postCognismRedeemMock).toHaveBeenCalledExactlyOnceWith({
      path: '/contact/redeem',
      redeemIds: ['r1', 'r3'],
    });
    expect(results).toEqual([
      {
        outcome: 'matched',
        httpStatus: 200,
        matchScore: 92,
        data: { id: 'c1' },
      },
      { outcome: 'not_found', httpStatus: 200 },
      {
        outcome: 'matched',
        httpStatus: 200,
        matchScore: 71,
        data: { id: 'c3' },
      },
    ]);
  });

  it('does not redeem a match below the requested minimum score', async () => {
    enrichReturns([
      { redeemId: 'r1', matchScore: 92 },
      { redeemId: 'r2', matchScore: 40 },
    ]);
    redeemReturns([['r1', { id: 'c1' }]]);

    const results = await runCognismEnrichment<Contact>({
      ...PATHS,
      requests: [
        { criteria: { email: 'a@acme.com' }, minMatchScore: 80 },
        { criteria: { email: 'b@acme.com' }, minMatchScore: 80 },
      ],
    });

    expect(postCognismRedeemMock).toHaveBeenCalledExactlyOnceWith({
      path: '/contact/redeem',
      redeemIds: ['r1'],
    });
    expect(results[1]).toEqual({ outcome: 'not_found', httpStatus: 200 });
  });

  it('treats a match with no score as below any requested minimum', async () => {
    enrichReturns([{ redeemId: 'r1' }]);

    const results = await runCognismEnrichment<Contact>({
      ...PATHS,
      requests: [{ criteria: { email: 'a@acme.com' }, minMatchScore: 1 }],
    });

    expect(postCognismRedeemMock).not.toHaveBeenCalled();
    expect(results).toEqual([{ outcome: 'not_found', httpStatus: 200 }]);
  });

  it('redeems a shared redeem id once and reports it for every request that matched it', async () => {
    enrichReturns([
      { redeemId: 'r1', matchScore: 92 },
      { redeemId: 'r1', matchScore: 92 },
    ]);
    redeemReturns([['r1', { id: 'c1' }]]);

    const results = await runCognismEnrichment<Contact>({
      ...PATHS,
      requests: [
        { criteria: { email: 'a@acme.com' } },
        { criteria: { email: 'a@acme.com' } },
      ],
    });

    expect(postCognismRedeemMock).toHaveBeenCalledExactlyOnceWith({
      path: '/contact/redeem',
      redeemIds: ['r1'],
    });
    expect(results[0]).toEqual(results[1]);
  });

  it('splits redeem ids into batches of twenty', async () => {
    const matches = Array.from({ length: 25 }, (_unused, index) => ({
      redeemId: `r${index}`,
      matchScore: 90,
    }));
    enrichReturns(matches);
    postCognismRedeemMock.mockImplementation(async ({ redeemIds }) => ({
      ok: true,
      dataByRedeemId: new Map(
        redeemIds.map((redeemId) => [redeemId, { id: redeemId }]),
      ),
    }));

    const results = await runCognismEnrichment<Contact>({
      ...PATHS,
      requests: matches.map((match) => ({ criteria: { id: match.redeemId } })),
    });

    expect(postCognismRedeemMock).toHaveBeenCalledTimes(2);
    expect(postCognismRedeemMock.mock.calls[0][0].redeemIds).toHaveLength(20);
    expect(postCognismRedeemMock.mock.calls[1][0].redeemIds).toHaveLength(5);
    expect(results.every((result) => result.outcome === 'matched')).toBe(true);
  });

  it('fails every request when the enrich call fails', async () => {
    postCognismRequestMock.mockResolvedValue({
      ok: false,
      httpStatus: 401,
      message: 'unauthorized',
    });

    expect(
      await runCognismEnrichment<Contact>({
        ...PATHS,
        requests: [{ criteria: { email: 'a@acme.com' } }],
      }),
    ).toEqual([{ outcome: 'error', httpStatus: 401, message: 'unauthorized' }]);
    expect(postCognismRedeemMock).not.toHaveBeenCalled();
  });

  it('fails every request when the enrich result count does not line up', async () => {
    enrichReturns([{ redeemId: 'r1' }]);

    expect(
      await runCognismEnrichment<Contact>({
        ...PATHS,
        requests: [
          { criteria: { email: 'a@acme.com' } },
          { criteria: { email: 'b@acme.com' } },
        ],
      }),
    ).toEqual([
      {
        outcome: 'error',
        httpStatus: 200,
        message: 'Cognism returned 1 enrich results for 2 requests (HTTP 200).',
      },
      {
        outcome: 'error',
        httpStatus: 200,
        message: 'Cognism returned 1 enrich results for 2 requests (HTTP 200).',
      },
    ]);
  });

  it('fails every request when the enrich payload has no results array', async () => {
    postCognismRequestMock.mockResolvedValue({
      ok: true,
      httpStatus: 200,
      json: { message: 'ok' },
    });

    expect(
      await runCognismEnrichment<Contact>({
        ...PATHS,
        requests: [{ criteria: { email: 'a@acme.com' } }],
      }),
    ).toEqual([
      {
        outcome: 'error',
        httpStatus: 200,
        message: 'Cognism returned an unexpected enrich payload (HTTP 200).',
      },
    ]);
  });

  it('errors only the records in a failed redeem batch', async () => {
    enrichReturns([{ redeemId: 'r1', matchScore: 92 }]);
    postCognismRedeemMock.mockResolvedValue({
      ok: false,
      httpStatus: 429,
      message: 'rate limited',
    });

    expect(
      await runCognismEnrichment<Contact>({
        ...PATHS,
        requests: [{ criteria: { email: 'a@acme.com' } }],
      }),
    ).toEqual([{ outcome: 'error', httpStatus: 200, message: 'rate limited' }]);
  });

  it('reports a record the redeem call silently dropped as not found', async () => {
    enrichReturns([{ redeemId: 'r1', matchScore: 92 }]);
    redeemReturns([]);

    expect(
      await runCognismEnrichment<Contact>({
        ...PATHS,
        requests: [{ criteria: { email: 'a@acme.com' } }],
      }),
    ).toEqual([{ outcome: 'not_found', httpStatus: 200 }]);
  });
});
