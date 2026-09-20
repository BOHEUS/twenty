import { ROCKETREACH_BASE_URL } from 'src/constants/rocketreach-base-url';
import { RATE_LIMIT_MAX_RETRIES } from 'src/constants/rate-limit-retry';
import { getRocketReachApiKey } from 'src/logic-functions/utils/get-rocketreach-api-key';
import { parseRetryAfterMs } from 'src/logic-functions/utils/parse-retry-after-ms';
import { sleep } from 'src/logic-functions/utils/sleep';

const TOO_MANY_REQUESTS_STATUS = 429;

export type RocketReachResponse =
  | { ok: true; httpStatus: number; json: unknown }
  | { ok: false; httpStatus: number; message: string };

const buildUrl = ({
  path,
  params,
}: {
  path: string;
  params: Record<string, string>;
}): string => {
  const searchParams = new URLSearchParams(params);

  return `${ROCKETREACH_BASE_URL}${path}?${searchParams.toString()}`;
};

export const getRocketReach = async ({
  path,
  params,
}: {
  path: string;
  params: Record<string, string>;
}): Promise<RocketReachResponse> => {
  const apiKey = getRocketReachApiKey();
  const url = buildUrl({ path, params });

  for (
    let attempt = 0;
    attempt <= RATE_LIMIT_MAX_RETRIES;
    attempt++
  ) {
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: { 'Api-Key': apiKey, Accept: 'application/json' },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      return {
        ok: false,
        httpStatus: 0,
        message: `RocketReach request failed: ${message}`,
      };
    }

    if (
      response.status === TOO_MANY_REQUESTS_STATUS &&
      attempt < RATE_LIMIT_MAX_RETRIES
    ) {
      await sleep(parseRetryAfterMs(response.headers.get('Retry-After')));
      continue;
    }

    let json: unknown;
    try {
      json = await response.json();
    } catch {
      return {
        ok: false,
        httpStatus: response.status,
        message: `RocketReach returned a non-JSON response (HTTP ${response.status}).`,
      };
    }

    return { ok: true, httpStatus: response.status, json };
  }

  return {
    ok: false,
    httpStatus: TOO_MANY_REQUESTS_STATUS,
    message: 'RocketReach rate limit exceeded; try again later.',
  };
};
