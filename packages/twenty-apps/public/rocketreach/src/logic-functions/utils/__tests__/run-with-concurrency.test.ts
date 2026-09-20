import { describe, expect, it } from 'vitest';

import { runWithConcurrency } from 'src/logic-functions/utils/run-with-concurrency';

describe('runWithConcurrency', () => {
  it('keeps results aligned with the input order', async () => {
    const results = await runWithConcurrency({
      items: [1, 2, 3, 4, 5],
      concurrency: 2,
      run: (item) => Promise.resolve(item * 2),
    });

    expect(results).toEqual([2, 4, 6, 8, 10]);
  });

  it('never exceeds the requested concurrency', async () => {
    let inFlight = 0;
    let peakInFlight = 0;

    await runWithConcurrency({
      items: [1, 2, 3, 4, 5, 6],
      concurrency: 2,
      run: async (item) => {
        inFlight++;
        peakInFlight = Math.max(peakInFlight, inFlight);
        await Promise.resolve();
        inFlight--;

        return item;
      },
    });

    expect(peakInFlight).toBeLessThanOrEqual(2);
  });

  it('returns an empty list without starting a worker', async () => {
    expect(
      await runWithConcurrency({
        items: [],
        concurrency: 4,
        run: () => Promise.reject(new Error('should not run')),
      }),
    ).toEqual([]);
  });
});
