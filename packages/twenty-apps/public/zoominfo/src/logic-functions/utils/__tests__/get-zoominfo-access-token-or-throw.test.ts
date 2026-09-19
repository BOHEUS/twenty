import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ZoomInfoAuthenticationError } from 'src/logic-functions/errors/zoominfo-authentication-error';
import { ZoomInfoConfigError } from 'src/logic-functions/errors/zoominfo-config-error';
import {
  getZoomInfoAccessTokenOrThrow,
  resetZoomInfoAccessTokenCache,
} from 'src/logic-functions/utils/get-zoominfo-access-token-or-throw';

const mockTokenResponse = (body: unknown, ok = true) =>
  vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 401,
    json: async () => body,
  });

beforeEach(() => {
  resetZoomInfoAccessTokenCache();
  process.env.ZOOMINFO_CLIENT_ID = 'client-id';
  process.env.ZOOMINFO_CLIENT_SECRET = 'client-secret';
});

afterEach(() => {
  delete process.env.ZOOMINFO_CLIENT_ID;
  delete process.env.ZOOMINFO_CLIENT_SECRET;
  vi.unstubAllGlobals();
});

describe('getZoomInfoAccessTokenOrThrow', () => {
  it('authenticates once and reuses the token across calls', async () => {
    const fetchMock = mockTokenResponse({
      access_token: 'token-1',
      expires_in: 3600,
      token_type: 'Bearer',
    });
    vi.stubGlobal('fetch', fetchMock);

    expect(await getZoomInfoAccessTokenOrThrow()).toBe('token-1');
    expect(await getZoomInfoAccessTokenOrThrow()).toBe('token-1');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.zoominfo.com/gtm/oauth/v1/token');
    expect(init.body).toContain('grant_type=client_credentials');
    expect(init.headers.Authorization).toBe(
      `Basic ${Buffer.from('client-id:client-secret').toString('base64')}`,
    );
  });

  it('re-authenticates once the token has expired', async () => {
    const fetchMock = mockTokenResponse({
      access_token: 'token-1',
      expires_in: 1,
    });
    vi.stubGlobal('fetch', fetchMock);

    await getZoomInfoAccessTokenOrThrow();
    await getZoomInfoAccessTokenOrThrow();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('reports missing credentials as a configuration problem', async () => {
    delete process.env.ZOOMINFO_CLIENT_SECRET;

    await expect(getZoomInfoAccessTokenOrThrow()).rejects.toBeInstanceOf(
      ZoomInfoConfigError,
    );
  });

  it('reports rejected credentials as an authentication problem', async () => {
    vi.stubGlobal('fetch', mockTokenResponse({}, false));

    await expect(getZoomInfoAccessTokenOrThrow()).rejects.toBeInstanceOf(
      ZoomInfoAuthenticationError,
    );
  });
});
