import { CRUSTDATA_RATE_LIMIT_MAX_WAIT_SECONDS } from 'src/constants/crustdata-api';
import { toText } from 'src/logic-functions/utils/to-text';
import { isDefined } from 'src/utils/is-defined';

const RETRY_AFTER_HEADERS = ['retry-after', 'x-ratelimit-reset'];

// Both headers carry whole seconds. `Retry-After` may also be an HTTP date, which is ignored here:
// a bad parse must not turn into an unbounded wait.
export const resolveRetryAfterSeconds = (
  response: Response,
): number | undefined => {
  for (const header of RETRY_AFTER_HEADERS) {
    const rawValue = toText(response.headers.get(header));

    if (!isDefined(rawValue)) {
      continue;
    }

    const seconds = Number.parseInt(rawValue, 10);

    if (Number.isFinite(seconds) && seconds >= 0) {
      return Math.min(seconds, CRUSTDATA_RATE_LIMIT_MAX_WAIT_SECONDS);
    }
  }

  return undefined;
};
