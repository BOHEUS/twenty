import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ROCKETREACH_API_KEY_VARIABLE_NAME } from 'src/constants/server-variable-names';
import { getRocketReach } from 'src/logic-functions/utils/get-rocketreach';

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

beforeEach(() => {
  process.env[ROCKETREACH_API_KEY_VARIABLE_NAME] = 'secret-key';
  vi.useFakeTimers();
});

afterEach(() => {
  delete process.env[ROCKETREACH_API_KEY_VARIABLE_NAME];
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('getRocketReach', () => {
  it('sends the key in the Api-Key header and the params in the query string', async () => {
    const fetchMock = vi.fn((_url: string, _requestInit?: RequestInit) =>
      Promise.resolve(jsonResponse({ id: 1 })),
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await getRocketReach({
      path: '/universal/person/lookup',
      params: { email: 'ada@example.com' },
    });

    expect(response).toEqual({ ok: true, httpStatus: 200, json: { id: 1 } });

    const [url, requestInit] = fetchMock.mock.calls[0];
    expect(url).toBe(
      'https://api.rocketreach.co/api/v2/universal/person/lookup?email=ada%40example.com',
    );
    expect((requestInit?.headers as Record<string, string>)['Api-Key']).toBe(
      'secret-key',
    );
  });

  it('waits for Retry-After and retries after a 429', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({}, { status: 429, headers: { 'Retry-After': '1' } }),
      )
      .mockResolvedValueOnce(jsonResponse({ id: 1 }));
    vi.stubGlobal('fetch', fetchMock);

    const responsePromise = getRocketReach({
      path: '/universal/person/lookup',
      params: {},
    });
    await vi.advanceTimersByTimeAsync(1_000);

    expect(await responsePromise).toMatchObject({ ok: true, httpStatus: 200 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('gives up after the retry budget and reports the rate limit', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({}, { status: 429, headers: { 'Retry-After': '1' } }),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const responsePromise = getRocketReach({
      path: '/universal/person/lookup',
      params: {},
    });
    await vi.advanceTimersByTimeAsync(10_000);

    expect(await responsePromise).toMatchObject({ ok: true, httpStatus: 429 });
  });

  it('reports a transport failure instead of throwing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('socket hang up'))),
    );

    expect(
      await getRocketReach({ path: '/universal/person/lookup', params: {} }),
    ).toEqual({
      ok: false,
      httpStatus: 0,
      message: 'RocketReach request failed: socket hang up',
    });
  });

  it('reports a non-JSON body instead of throwing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('<html>502</html>', { status: 502 }))),
    );

    expect(
      await getRocketReach({ path: '/universal/person/lookup', params: {} }),
    ).toEqual({
      ok: false,
      httpStatus: 502,
      message: 'RocketReach returned a non-JSON response (HTTP 502).',
    });
  });
});
