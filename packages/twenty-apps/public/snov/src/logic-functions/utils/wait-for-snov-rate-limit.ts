import { SNOV_REQUEST_INTERVAL_MS } from 'src/constants/snov-request-timing';
import { sleep } from 'src/logic-functions/utils/sleep';

let nextRequestAt = 0;

export const waitForSnovRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const requestAt = Math.max(now, nextRequestAt);

  nextRequestAt = requestAt + SNOV_REQUEST_INTERVAL_MS;

  if (requestAt > now) {
    await sleep(requestAt - now);
  }
};
