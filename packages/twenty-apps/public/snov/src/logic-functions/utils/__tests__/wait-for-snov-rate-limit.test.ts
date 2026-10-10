import { afterEach, describe, expect, it, vi } from 'vitest';

import { sleep } from 'src/logic-functions/utils/sleep';
import { waitForSnovRateLimit } from 'src/logic-functions/utils/wait-for-snov-rate-limit';

vi.mock('src/logic-functions/utils/sleep', () => ({
  sleep: vi.fn(async () => undefined),
}));

describe('waitForSnovRateLimit', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('spaces consecutive requests one second apart', async () => {
    vi.useFakeTimers({ now: 1_000_000 });

    await waitForSnovRateLimit();
    await waitForSnovRateLimit();
    await waitForSnovRateLimit();

    expect(
      vi.mocked(sleep).mock.calls.map(([durationMs]) => durationMs),
    ).toEqual([1_000, 2_000]);
  });
});
