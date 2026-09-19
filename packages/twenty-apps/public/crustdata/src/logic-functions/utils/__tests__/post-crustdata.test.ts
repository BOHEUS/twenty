import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { postCrustdata } from 'src/logic-functions/utils/post-crustdata';

const rateLimited = (headers: Record<string, string>) =>
  new Response(JSON.stringify({ error: { message: 'Rate limit exceeded' } }), {
    status: 429,
    headers,
  });

const ok = () =>
  new Response(JSON.stringify([]), {
    status: 200,
    headers: { 'x-credits-used': '2' },
  });

beforeEach(() => {
  process.env.CRUSTDATA_API_KEY = 'test-key';
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  delete process.env.CRUSTDATA_API_KEY;
});

describe('postCrustdata', () => {
  it('retries a 429 after the window named by x-ratelimit-reset', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(rateLimited({ 'x-ratelimit-reset': '3' }))
      .mockResolvedValueOnce(ok());
    vi.stubGlobal('fetch', fetchMock);

    const pending = postCrustdata({ path: '/person/enrich', body: {} });
    await vi.advanceTimersByTimeAsync(3000);

    await expect(pending).resolves.toMatchObject({ httpStatus: 200 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('honours Retry-After as well', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(rateLimited({ 'retry-after': '1' }))
      .mockResolvedValueOnce(ok());
    vi.stubGlobal('fetch', fetchMock);

    const pending = postCrustdata({ path: '/company/enrich', body: {} });
    await vi.advanceTimersByTimeAsync(1000);

    await expect(pending).resolves.toMatchObject({ httpStatus: 200 });
  });

  it('gives up after the retry ceiling and returns the 429', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(rateLimited({ 'retry-after': '1' }));
    vi.stubGlobal('fetch', fetchMock);

    const pending = postCrustdata({ path: '/person/enrich', body: {} });
    await vi.advanceTimersByTimeAsync(10_000);

    await expect(pending).resolves.toMatchObject({ httpStatus: 429 });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('does not retry a 429 with no retry hint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(rateLimited({}));
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      postCrustdata({ path: '/person/enrich', body: {} }),
    ).resolves.toMatchObject({ httpStatus: 429 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
