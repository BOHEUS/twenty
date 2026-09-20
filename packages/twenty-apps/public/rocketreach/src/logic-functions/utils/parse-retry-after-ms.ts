import {
  RATE_LIMIT_FALLBACK_DELAY_MS,
  RATE_LIMIT_MAX_DELAY_MS,
} from 'src/constants/rate-limit-retry';

const MILLISECONDS_PER_SECOND = 1_000;

// RocketReach answers 429 with Retry-After in seconds; some proxies send a date.
export const parseRetryAfterMs = (retryAfterHeader: string | null): number => {
  if (retryAfterHeader === null) {
    return RATE_LIMIT_FALLBACK_DELAY_MS;
  }

  const retryAfterSeconds = Number(retryAfterHeader.trim());
  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
    return Math.min(
      retryAfterSeconds * MILLISECONDS_PER_SECOND,
      RATE_LIMIT_MAX_DELAY_MS,
    );
  }

  const retryAtTimestamp = Date.parse(retryAfterHeader);
  if (Number.isNaN(retryAtTimestamp)) {
    return RATE_LIMIT_FALLBACK_DELAY_MS;
  }

  return Math.min(
    Math.max(retryAtTimestamp - Date.now(), 0),
    RATE_LIMIT_MAX_DELAY_MS,
  );
};
