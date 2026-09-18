import { beforeEach, describe, expect, it, vi } from 'vitest';

import { postCognismRedeem } from 'src/logic-functions/utils/post-cognism-redeem';
import { postCognismRequest } from 'src/logic-functions/utils/post-cognism-request';

vi.mock('src/logic-functions/utils/post-cognism-request', () => ({
  postCognismRequest: vi.fn(),
}));

const postCognismRequestMock = vi.mocked(postCognismRequest);

describe('postCognismRedeem', () => {
  beforeEach(() => {
    postCognismRequestMock.mockReset();
  });

  it('posts the redeem ids and keys the records by the echoed redeem id', async () => {
    postCognismRequestMock.mockResolvedValue({
      ok: true,
      httpStatus: 200,
      json: {
        results: [
          { redeemId: 'r2', id: 'c2' },
          { redeemId: 'r1', id: 'c1' },
        ],
      },
    });

    const outcome = await postCognismRedeem<{ id: string }>({
      path: '/contact/redeem',
      redeemIds: ['r1', 'r2'],
    });

    expect(postCognismRequestMock).toHaveBeenCalledExactlyOnceWith({
      path: '/contact/redeem',
      body: { redeemIds: ['r1', 'r2'] },
    });
    expect(outcome).toEqual({
      ok: true,
      dataByRedeemId: new Map([
        ['r2', { redeemId: 'r2', id: 'c2' }],
        ['r1', { redeemId: 'r1', id: 'c1' }],
      ]),
    });
  });

  it('falls back to the request order when Cognism does not echo the redeem id', async () => {
    postCognismRequestMock.mockResolvedValue({
      ok: true,
      httpStatus: 200,
      json: [{ id: 'c1' }, { id: 'c2' }],
    });

    const outcome = await postCognismRedeem<{ id: string }>({
      path: '/contact/redeem',
      redeemIds: ['r1', 'r2'],
    });

    expect(outcome).toEqual({
      ok: true,
      dataByRedeemId: new Map([
        ['r1', { id: 'c1' }],
        ['r2', { id: 'c2' }],
      ]),
    });
  });

  it('passes a request failure through', async () => {
    postCognismRequestMock.mockResolvedValue({
      ok: false,
      httpStatus: 429,
      message: 'rate limited',
    });

    expect(
      await postCognismRedeem({ path: '/contact/redeem', redeemIds: ['r1'] }),
    ).toEqual({ ok: false, httpStatus: 429, message: 'rate limited' });
  });

  it('reports an unexpected payload shape', async () => {
    postCognismRequestMock.mockResolvedValue({
      ok: true,
      httpStatus: 200,
      json: { message: 'ok' },
    });

    expect(
      await postCognismRedeem({ path: '/contact/redeem', redeemIds: ['r1'] }),
    ).toEqual({
      ok: false,
      httpStatus: 200,
      message: 'Cognism returned an unexpected redeem payload (HTTP 200).',
    });
  });
});
