import { HUNTER_BASE_URL } from 'src/constants/hunter-base-url';
import { extractHunterErrorMessage } from 'src/logic-functions/utils/extract-hunter-error-message';
import { getHunterApiKey } from 'src/logic-functions/utils/get-hunter-api-key';
import { parseRetryAfterMs } from 'src/logic-functions/utils/parse-retry-after-ms';
import { sleep } from 'src/logic-functions/utils/sleep';
import { waitForHunterRateLimit } from 'src/logic-functions/utils/wait-for-hunter-rate-limit';
import { type HunterRequestResult } from 'src/types/hunter-request-result';
import { isRecord } from 'src/utils/is-record';

const MAX_RATE_LIMIT_RETRIES = 2;

// Hunter answers 403 when its rate limit is hit and 429 when the plan's usage
// limit is reached, the reverse of the usual convention
const RATE_LIMIT_HTTP_STATUS = 403;

// 451 means the person asked Hunter not to process their data
const NOT_FOUND_HTTP_STATUSES: ReadonlySet<number> = new Set([404, 451]);

export const callHunter = async ({
  path,
  query,
}: {
  path: string;
  query: Record<string, string>;
}): Promise<HunterRequestResult> => {
  const apiKey = getHunterApiKey();
  const url = `${HUNTER_BASE_URL}${path}?${new URLSearchParams(query)}`;

  for (let attempt = 0; ; attempt++) {
    await waitForHunterRateLimit();

    let response: Response;
    try {
      response = await fetch(url, { headers: { 'X-API-KEY': apiKey } });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      return {
        status: 'error',
        httpStatus: 0,
        message: `Hunter request failed: ${message}`,
      };
    }

    if (
      response.status === RATE_LIMIT_HTTP_STATUS &&
      attempt < MAX_RATE_LIMIT_RETRIES
    ) {
      await sleep(parseRetryAfterMs(response.headers.get('Retry-After')));
      continue;
    }

    if (NOT_FOUND_HTTP_STATUSES.has(response.status)) {
      return { status: 'not_found' };
    }

    const json: unknown = await response.json().catch(() => undefined);

    if (!response.ok || !isRecord(json) || !isRecord(json.data)) {
      return {
        status: 'error',
        httpStatus: response.status,
        message: extractHunterErrorMessage({
          json,
          httpStatus: response.status,
        }),
      };
    }

    return { status: 'found', json: json.data };
  }
};
