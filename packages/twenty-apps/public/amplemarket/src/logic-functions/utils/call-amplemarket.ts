import { AMPLEMARKET_BASE_URL } from 'src/constants/amplemarket-base-url';
import { AMPLEMARKET_REQUEST_TIMEOUT_MS } from 'src/constants/amplemarket-request-timing';
import { extractAmplemarketErrorMessage } from 'src/logic-functions/utils/extract-amplemarket-error-message';
import { getAmplemarketApiKey } from 'src/logic-functions/utils/get-amplemarket-api-key';
import { parseRetryAfterMs } from 'src/logic-functions/utils/parse-retry-after-ms';
import { sleep } from 'src/logic-functions/utils/sleep';
import { waitForAmplemarketRateLimit } from 'src/logic-functions/utils/wait-for-amplemarket-rate-limit';
import { type AmplemarketRequestResult } from 'src/types/amplemarket-request-result';
import { isRecord } from 'src/utils/is-record';

const MAX_RATE_LIMIT_RETRIES = 2;

// 451 means the person was found but removed for privacy reasons
const NOT_FOUND_HTTP_STATUSES: ReadonlySet<number> = new Set([404, 451]);

export const callAmplemarket = async ({
  path,
  query,
  deadline,
}: {
  path: string;
  query: Record<string, string>;
  deadline: number;
}): Promise<AmplemarketRequestResult> => {
  const apiKey = getAmplemarketApiKey();
  const url = `${AMPLEMARKET_BASE_URL}${path}?${new URLSearchParams(query)}`;

  for (let attempt = 0; ; attempt++) {
    await waitForAmplemarketRateLimit();

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(AMPLEMARKET_REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      return {
        status: 'error',
        httpStatus: 0,
        message: `Amplemarket request failed: ${message}`,
      };
    }

    if (response.status === 429 && attempt < MAX_RATE_LIMIT_RETRIES) {
      const retryAfterMs = parseRetryAfterMs(
        response.headers.get('Retry-After'),
      );

      if (Date.now() + retryAfterMs < deadline) {
        await sleep(retryAfterMs);
        continue;
      }
    }

    if (NOT_FOUND_HTTP_STATUSES.has(response.status)) {
      return { status: 'not_found' };
    }

    const json: unknown = await response.json().catch(() => undefined);

    if (!response.ok || !isRecord(json)) {
      return {
        status: 'error',
        httpStatus: response.status,
        message: extractAmplemarketErrorMessage({
          json,
          httpStatus: response.status,
        }),
      };
    }

    return { status: 'found', json };
  }
};
