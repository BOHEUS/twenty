import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { callLushaApi } from 'src/logic-functions/utils/call-lusha-api';

const fetchMock = vi.fn();

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const callWithoutRetryDelays = () =>
  callLushaApi({
    path: '/companies/search-and-enrich',
    apiKey: 'lusha-api-key',
    body: {
      companies: [{ clientReferenceId: 'company-1', domain: 'lusha.com' }],
    },
    retryDelaysInMilliseconds: [0, 0],
  });

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

describe('callLushaApi', () => {
  it('should post the body to the V3 endpoint and return the results', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, {
        results: [{ clientReferenceId: 'company-1' }],
        billing: { creditsCharged: 2, resultsReturned: 1 },
      }),
    );

    const result = await callWithoutRetryDelays();

    expect(result).toEqual({
      success: true,
      data: [{ clientReferenceId: 'company-1' }],
      creditsCharged: 2,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.lusha.com/v3/companies/search-and-enrich',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ api_key: 'lusha-api-key' }),
        body: JSON.stringify({
          companies: [{ clientReferenceId: 'company-1', domain: 'lusha.com' }],
        }),
      }),
    );
  });

  it('should treat a rejected API key as an account failure', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(401, { statusCode: 401, message: 'Invalid API key' }),
    );

    expect(await callWithoutRetryDelays()).toEqual({
      success: false,
      error:
        'Lusha rejected the API key. Check the key in the Lusha app settings.',
      isAccountFailure: true,
    });
  });

  it('should treat a malformed API key as a rejected key', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(400, { statusCode: 400, message: 'Invalid API key format' }),
    );

    expect(await callWithoutRetryDelays()).toEqual({
      success: false,
      error:
        'Lusha rejected the API key. Check the key in the Lusha app settings.',
      isAccountFailure: true,
    });
  });

  it('should pass on why Lusha refused the account', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(403, {
        statusCode: 403,
        message: 'V3 API access is not enabled for your account',
      }),
    );

    expect(await callWithoutRetryDelays()).toEqual({
      success: false,
      error:
        'Lusha request failed (HTTP 403): V3 API access is not enabled for your account',
      isAccountFailure: true,
    });
  });

  it('should report an invalid request without stopping the run', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(400, {
        statusCode: 400,
        message: 'Validation failed',
        errors: ['companies.0.domain must be a string'],
      }),
    );

    expect(await callWithoutRetryDelays()).toEqual({
      success: false,
      error:
        'Lusha request failed (HTTP 400): companies.0.domain must be a string',
      isAccountFailure: false,
    });
  });

  it('should report what the plan has left when the rate limit is reached', async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ statusCode: 429 }), {
          status: 429,
          headers: {
            'content-type': 'application/json',
            'x-minute-requests-left': '0',
            'x-hourly-requests-left': '120',
            'x-daily-requests-left': '3400',
          },
        }),
      ),
    );

    expect(await callWithoutRetryDelays()).toEqual({
      success: false,
      error:
        'Lusha rate limit reached (0 left this minute, 120 left this hour, 3400 left today). Try again later.',
      isAccountFailure: true,
    });
  });

  it('should report a rate limit whose headers Lusha left out', async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(jsonResponse(429, { statusCode: 429 })),
    );

    expect(await callWithoutRetryDelays()).toEqual({
      success: false,
      error: 'Lusha rate limit reached. Try again later.',
      isAccountFailure: true,
    });
  });

  it('should retry after a rate limit and return the later success', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(429, { statusCode: 429 }))
      .mockResolvedValueOnce(jsonResponse(200, { results: [] }));

    const result = await callWithoutRetryDelays();

    expect(result).toEqual({ success: true, data: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('should give up once the retries are spent', async () => {
    fetchMock.mockImplementation(() =>
      Promise.resolve(jsonResponse(503, { statusCode: 503 })),
    );

    const result = await callWithoutRetryDelays();

    expect(result).toEqual({
      success: false,
      error: 'Lusha request failed (HTTP 503).',
      isAccountFailure: false,
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('should report a network failure', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));

    expect(await callWithoutRetryDelays()).toEqual({
      success: false,
      error: 'Lusha could not be reached: fetch failed',
      isAccountFailure: false,
    });
  });

  it('should report a response that is not a JSON object', async () => {
    fetchMock.mockResolvedValue(new Response('<html></html>', { status: 200 }));

    expect(await callWithoutRetryDelays()).toEqual({
      success: false,
      error: 'Lusha returned an unreadable response.',
      isAccountFailure: false,
    });
  });
});
