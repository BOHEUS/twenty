import { HUNTER_REQUEST_INTERVAL_MS } from 'src/constants/hunter-request-timing';
import { sleep } from 'src/logic-functions/utils/sleep';

let nextRequestAt = 0;

export const waitForHunterRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const requestAt = Math.max(now, nextRequestAt);

  nextRequestAt = requestAt + HUNTER_REQUEST_INTERVAL_MS;

  if (requestAt > now) {
    await sleep(requestAt - now);
  }
};
