import { describe, expect, it, vi } from 'vitest';

import { RATE_LIMIT_FALLBACK_DELAY_MS } from 'src/constants/rate-limit-retry';
import { parseRetryAfterMs } from 'src/logic-functions/utils/parse-retry-after-ms';

describe('parseRetryAfterMs', () => {
  it('reads a delay expressed in seconds', () => {
    expect(parseRetryAfterMs('5')).toBe(5_000);
  });

  it('reads a delay expressed as an HTTP date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-20T10:00:00Z'));

    expect(parseRetryAfterMs('Sun, 20 Sep 2026 10:00:10 GMT')).toBe(10_000);

    vi.useRealTimers();
  });

  it('caps the delay so a run cannot stall indefinitely', () => {
    expect(parseRetryAfterMs('600')).toBe(30_000);
  });

  it('falls back when the header is missing or unparseable', () => {
    expect(parseRetryAfterMs(null)).toBe(RATE_LIMIT_FALLBACK_DELAY_MS);
    expect(parseRetryAfterMs('soon')).toBe(RATE_LIMIT_FALLBACK_DELAY_MS);
  });
});
