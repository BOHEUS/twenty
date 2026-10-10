import { isNonEmptyString, isNumber } from '@sniptt/guards';

import { SNOV_BASE_URL } from 'src/constants/snov-base-url';
import { SnovConfigError } from 'src/logic-functions/errors/snov-config-error';
import { SnovOperationError } from 'src/logic-functions/errors/snov-operation-error';
import { extractSnovErrorMessage } from 'src/logic-functions/utils/extract-snov-error-message';
import { getSnovCredentials } from 'src/logic-functions/utils/get-snov-credentials';
import { waitForSnovRateLimit } from 'src/logic-functions/utils/wait-for-snov-rate-limit';
import { isRecord } from 'src/utils/is-record';

const TOKEN_EXPIRY_MARGIN_MS = 60_000;

let cachedToken: { accessToken: string; expiresAt: number } | undefined;

export const getSnovAccessToken = async (): Promise<string> => {
  if (
    cachedToken !== undefined &&
    cachedToken.expiresAt - TOKEN_EXPIRY_MARGIN_MS > Date.now()
  ) {
    return cachedToken.accessToken;
  }

  const { clientId, clientSecret } = getSnovCredentials();

  await waitForSnovRateLimit();
  const response = await fetch(`${SNOV_BASE_URL}/v1/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const json: unknown = await response.json().catch(() => undefined);

  if (!response.ok || !isRecord(json) || !isNonEmptyString(json.access_token)) {
    const errorMessage = extractSnovErrorMessage({
      json,
      httpStatus: response.status,
    });

    throw response.status >= 500
      ? new SnovOperationError(`Snov.io sign-in failed: ${errorMessage}`)
      : new SnovConfigError(
          `Snov.io rejected the API credentials: ${errorMessage}`,
        );
  }

  cachedToken = {
    accessToken: json.access_token,
    expiresAt:
      Date.now() + (isNumber(json.expires_in) ? json.expires_in : 3600) * 1000,
  };

  return cachedToken.accessToken;
};

export const resetSnovAccessTokenCache = (): void => {
  cachedToken = undefined;
};
