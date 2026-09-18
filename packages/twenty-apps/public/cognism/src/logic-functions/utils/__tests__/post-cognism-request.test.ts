import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { postCognismRequest } from 'src/logic-functions/utils/post-cognism-request';

const jsonResponse = (body: unknown, status = 200): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }) as unknown as Response;

describe('postCognismRequest', () => {
  beforeEach(() => {
    process.env.COGNISM_API_KEY = 'test-key';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.COGNISM_API_KEY;
  });

  it('posts JSON with a bearer token and returns the parsed body', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ results: [] }));
    vi.stubGlobal('fetch', fetchMock);

    const outcome = await postCognismRequest({
      path: '/contact/enrich',
      body: { contacts: [{ email: 'jane@acme.com' }] },
    });

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      'https://app.cognism.com/api/search/contact/enrich',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-key',
        },
        body: JSON.stringify({ contacts: [{ email: 'jane@acme.com' }] }),
      },
    );
    expect(outcome).toEqual({
      ok: true,
      httpStatus: 200,
      json: { results: [] },
    });
  });

  it('surfaces the Cognism error message on a failed response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse({ error: { message: 'no entitlement' } }, 403),
      ),
    );

    expect(
      await postCognismRequest({ path: '/contact/enrich', body: {} }),
    ).toEqual({ ok: false, httpStatus: 403, message: 'no entitlement' });
  });

  it('reports a non-JSON response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          ({
            ok: true,
            status: 200,
            json: async () => {
              throw new Error('bad json');
            },
          }) as unknown as Response,
      ),
    );

    expect(
      await postCognismRequest({ path: '/contact/enrich', body: {} }),
    ).toEqual({
      ok: false,
      httpStatus: 200,
      message: 'Cognism returned a non-JSON response (HTTP 200).',
    });
  });

  it('reports a transport failure with http status 0', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('socket hang up');
      }),
    );

    expect(
      await postCognismRequest({ path: '/contact/enrich', body: {} }),
    ).toEqual({
      ok: false,
      httpStatus: 0,
      message: 'Cognism request failed: socket hang up',
    });
  });

  it('throws when the API key is not configured', async () => {
    delete process.env.COGNISM_API_KEY;

    await expect(
      postCognismRequest({ path: '/contact/enrich', body: {} }),
    ).rejects.toThrow('COGNISM_API_KEY is not set.');
  });
});
