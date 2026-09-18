import { isDefined } from 'twenty-sdk/utils';

import {
  LUSHA_API_BASE_URL,
  LUSHA_REQUEST_TIMEOUT_MILLISECONDS,
  LUSHA_RETRY_DELAYS_MILLISECONDS,
} from 'src/constants/lusha-api.constant';
import { toJsonArray, toJsonObject } from 'src/logic-functions/data/to-json';
import { toNumber } from 'src/logic-functions/data/to-number';
import { type LushaApiResult } from 'src/logic-functions/types/lusha-api-result.type';
import { buildLushaError } from 'src/logic-functions/utils/build-lusha-error';
import { readLushaRateLimit } from 'src/logic-functions/utils/read-lusha-rate-limit';

const isRetryableStatus = (status: number): boolean =>
  status === 429 || status >= 500;

const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const fetchWithRetries = async ({
  url,
  apiKey,
  body,
  retryDelaysInMilliseconds,
}: {
  url: string;
  apiKey: string;
  body: Record<string, unknown>;
  retryDelaysInMilliseconds: number[];
}): Promise<Response> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      api_key: apiKey,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(LUSHA_REQUEST_TIMEOUT_MILLISECONDS),
  });

  const [retryDelayInMilliseconds, ...remainingRetryDelaysInMilliseconds] =
    retryDelaysInMilliseconds;

  if (
    !isRetryableStatus(response.status) ||
    !isDefined(retryDelayInMilliseconds)
  ) {
    return response;
  }

  await sleep(retryDelayInMilliseconds);

  return fetchWithRetries({
    url,
    apiKey,
    body,
    retryDelaysInMilliseconds: remainingRetryDelaysInMilliseconds,
  });
};

export const callLushaApi = async ({
  path,
  apiKey,
  body,
  retryDelaysInMilliseconds = LUSHA_RETRY_DELAYS_MILLISECONDS,
}: {
  path: string;
  apiKey: string;
  body: Record<string, unknown>;
  retryDelaysInMilliseconds?: number[];
}): Promise<LushaApiResult> => {
  let response: Response;

  try {
    response = await fetchWithRetries({
      url: `${LUSHA_API_BASE_URL}${path}`,
      apiKey,
      body,
      retryDelaysInMilliseconds,
    });
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error && error.name === 'TimeoutError'
          ? 'Lusha did not respond in time.'
          : `Lusha could not be reached: ${error instanceof Error ? error.message : String(error)}`,
      isAccountFailure: false,
    };
  }

  const payload: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    const { message, isAccountFailure } = buildLushaError({
      status: response.status,
      payload,
      rateLimit: readLushaRateLimit(response.headers),
    });

    return { success: false, error: message, isAccountFailure };
  }

  const data = toJsonObject(payload);

  return isDefined(data)
    ? {
        success: true,
        data: (toJsonArray(data.results) ?? [])
          .map(toJsonObject)
          .filter(isDefined),
        creditsCharged: toNumber(toJsonObject(data.billing)?.creditsCharged),
      }
    : {
        success: false,
        error: 'Lusha returned an unreadable response.',
        isAccountFailure: false,
      };
};
