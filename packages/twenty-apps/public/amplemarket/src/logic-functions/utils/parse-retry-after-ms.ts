const DEFAULT_RETRY_AFTER_MS = 5_000;
const MAX_RETRY_AFTER_MS = 60_000;

export const parseRetryAfterMs = (retryAfterHeader: string | null): number => {
  const retryAfterSeconds = Number.parseFloat(retryAfterHeader ?? '');

  if (!Number.isFinite(retryAfterSeconds) || retryAfterSeconds < 0) {
    return DEFAULT_RETRY_AFTER_MS;
  }

  return Math.min(retryAfterSeconds * 1_000, MAX_RETRY_AFTER_MS);
};
