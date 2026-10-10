import { AMPLEMARKET_REQUEST_INTERVAL_MS } from 'src/constants/amplemarket-request-timing';
import { sleep } from 'src/logic-functions/utils/sleep';

let nextRequestAt = 0;

export const waitForAmplemarketRateLimit = async (): Promise<void> => {
  const now = Date.now();
  const requestAt = Math.max(now, nextRequestAt);

  nextRequestAt = requestAt + AMPLEMARKET_REQUEST_INTERVAL_MS;

  if (requestAt > now) {
    await sleep(requestAt - now);
  }
};
