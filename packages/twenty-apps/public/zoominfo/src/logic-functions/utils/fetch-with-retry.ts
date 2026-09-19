import { isDefined } from 'twenty-sdk/utils';

import { toNumberLike } from 'src/logic-functions/utils/to-number-like';

const MAX_ATTEMPTS = 3;
const DEFAULT_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30_000;

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

const sleep = (durationMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, durationMs));

// ZoomInfo rejects on a per-second, per-hour and per-day budget at once and
// names the wait in Retry-After; rejected requests do not consume quota.
const resolveBackoffMs = ({
  response,
  attempt,
}: {
  response: Response;
  attempt: number;
}): number => {
  const retryAfterSeconds = toNumberLike(response.headers.get('Retry-After'));

  if (isDefined(retryAfterSeconds)) {
    return Math.min(retryAfterSeconds * 1000, MAX_BACKOFF_MS);
  }

  return Math.min(DEFAULT_BACKOFF_MS * 2 ** (attempt - 1), MAX_BACKOFF_MS);
};

export const fetchWithRetry = async (
  url: string,
  init: RequestInit,
): Promise<Response> => {
  let response = await fetch(url, init);

  for (let attempt = 1; attempt < MAX_ATTEMPTS; attempt++) {
    if (!RETRYABLE_STATUSES.has(response.status)) {
      return response;
    }

    await sleep(resolveBackoffMs({ response, attempt }));
    response = await fetch(url, init);
  }

  return response;
};
