import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchWithRetry } from 'src/logic-functions/utils/fetch-with-retry';

const buildResponse = (status: number, retryAfter?: string) =>
  ({
    status,
    headers: { get: () => retryAfter ?? null },
  }) as unknown as Response;

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('fetchWithRetry', () => {
  it('returns a successful response without retrying', async () => {
    const fetchMock = vi.fn().mockResolvedValue(buildResponse(200));
    vi.stubGlobal('fetch', fetchMock);

    const response = await fetchWithRetry('https://example.com', {});

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not retry a client error it cannot fix', async () => {
    const fetchMock = vi.fn().mockResolvedValue(buildResponse(400));
    vi.stubGlobal('fetch', fetchMock);

    await fetchWithRetry('https://example.com', {});

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('waits the interval ZoomInfo asks for, then retries', async () => {
    vi.useFakeTimers();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(buildResponse(429, '2'))
      .mockResolvedValueOnce(buildResponse(200));
    vi.stubGlobal('fetch', fetchMock);

    const responsePromise = fetchWithRetry('https://example.com', {});
    await vi.advanceTimersByTimeAsync(2000);

    expect((await responsePromise).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('gives up after three attempts', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue(buildResponse(503));
    vi.stubGlobal('fetch', fetchMock);

    const responsePromise = fetchWithRetry('https://example.com', {});
    await vi.advanceTimersByTimeAsync(60_000);

    expect((await responsePromise).status).toBe(503);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
