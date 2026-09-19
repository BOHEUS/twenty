import { isNonEmptyString, isNumber } from '@sniptt/guards';
import { isDefined } from 'twenty-sdk/utils';

import { ZOOMINFO_BASE_URL } from 'src/constants/zoominfo-base-url';
import { ZOOMINFO_SCOPES } from 'src/constants/zoominfo-scopes';
import { ZOOMINFO_TOKEN_PATH } from 'src/constants/zoominfo-token-path';
import { ZoomInfoAuthenticationError } from 'src/logic-functions/errors/zoominfo-authentication-error';
import { getZoomInfoCredentialsOrThrow } from 'src/logic-functions/utils/get-zoominfo-credentials-or-throw';
import { isRecord } from 'src/utils/is-record';
import { toErrorMessage } from 'src/utils/to-error-message';

// Tokens are reused across the batches of a single bulk run; the margin keeps a
// token from expiring mid-flight.
const EXPIRY_SAFETY_MARGIN_MS = 60_000;
const FALLBACK_TOKEN_LIFETIME_SECONDS = 3600;

let cachedToken: { accessToken: string; expiresAtMs: number } | undefined;

export const resetZoomInfoAccessTokenCache = (): void => {
  cachedToken = undefined;
};

export const getZoomInfoAccessTokenOrThrow = async (): Promise<string> => {
  if (isDefined(cachedToken) && cachedToken.expiresAtMs > Date.now()) {
    return cachedToken.accessToken;
  }

  const { clientId, clientSecret } = getZoomInfoCredentialsOrThrow();
  const basicCredentials = Buffer.from(
    `${clientId}:${clientSecret}`,
  ).toString('base64');

  let response: Response;
  try {
    response = await fetch(`${ZOOMINFO_BASE_URL}${ZOOMINFO_TOKEN_PATH}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: ZOOMINFO_SCOPES,
      }).toString(),
    });
  } catch (error) {
    throw new ZoomInfoAuthenticationError(
      `ZoomInfo authentication request failed: ${toErrorMessage(error)}`,
    );
  }

  if (!response.ok) {
    throw new ZoomInfoAuthenticationError(
      `ZoomInfo rejected the OAuth credentials (HTTP ${response.status}).`,
    );
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    throw new ZoomInfoAuthenticationError(
      'ZoomInfo returned a non-JSON token response.',
    );
  }

  const tokenResponse = isRecord(json) ? json : {};
  const accessToken = tokenResponse.access_token;

  if (!isNonEmptyString(accessToken)) {
    throw new ZoomInfoAuthenticationError(
      'ZoomInfo token response did not contain an access_token.',
    );
  }

  const expiresInSeconds = isNumber(tokenResponse.expires_in)
    ? tokenResponse.expires_in
    : FALLBACK_TOKEN_LIFETIME_SECONDS;

  cachedToken = {
    accessToken,
    expiresAtMs:
      Date.now() + expiresInSeconds * 1000 - EXPIRY_SAFETY_MARGIN_MS,
  };

  return accessToken;
};
