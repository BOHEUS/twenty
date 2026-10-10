import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SnovConfigError } from 'src/logic-functions/errors/snov-config-error';
import { SnovOperationError } from 'src/logic-functions/errors/snov-operation-error';
import {
  getSnovAccessToken,
  resetSnovAccessTokenCache,
} from 'src/logic-functions/utils/get-snov-access-token';

vi.mock('src/logic-functions/utils/wait-for-snov-rate-limit', () => ({
  waitForSnovRateLimit: vi.fn(async () => undefined),
}));

const stubTokenResponse = (status: number, json: unknown) => {
  const fetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify(json), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
  );
  vi.stubGlobal('fetch', fetchMock);

  return fetchMock;
};

describe('getSnovAccessToken', () => {
  beforeEach(() => {
    resetSnovAccessTokenCache();
    vi.stubEnv('SNOV_CLIENT_ID', 'client-id');
    vi.stubEnv('SNOV_CLIENT_SECRET', 'client-secret');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('reuses the token until it is about to expire', async () => {
    const fetchMock = stubTokenResponse(200, {
      access_token: 'token-1',
      expires_in: 3600,
    });

    expect(await getSnovAccessToken()).toBe('token-1');
    expect(await getSnovAccessToken()).toBe('token-1');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('treats rejected credentials as a configuration error', async () => {
    stubTokenResponse(401, { error: 'invalid_client' });

    await expect(getSnovAccessToken()).rejects.toBeInstanceOf(SnovConfigError);
  });

  it('treats a Snov.io outage as a failed operation, not bad credentials', async () => {
    stubTokenResponse(503, { error: 'Service unavailable' });

    await expect(getSnovAccessToken()).rejects.toBeInstanceOf(
      SnovOperationError,
    );
  });
});
