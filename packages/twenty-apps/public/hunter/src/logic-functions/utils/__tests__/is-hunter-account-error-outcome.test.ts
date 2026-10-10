import { describe, expect, it } from 'vitest';

import { isHunterAccountErrorOutcome } from 'src/logic-functions/utils/is-hunter-account-error-outcome';

describe('isHunterAccountErrorOutcome', () => {
  it.each([401, 429])('flags an HTTP %i error', (httpStatus) => {
    expect(
      isHunterAccountErrorOutcome({
        outcome: 'error',
        httpStatus,
        message: 'rejected',
      }),
    ).toBe(true);
  });

  it.each([403, 500])('does not flag an HTTP %i error', (httpStatus) => {
    expect(
      isHunterAccountErrorOutcome({
        outcome: 'error',
        httpStatus,
        message: 'boom',
      }),
    ).toBe(false);
  });

  it('does not flag a matched outcome', () => {
    expect(
      isHunterAccountErrorOutcome({
        outcome: 'matched',
        data: { id: 'a' },
      }),
    ).toBe(false);
  });

  it('does not flag a missing outcome', () => {
    expect(isHunterAccountErrorOutcome(undefined)).toBe(false);
  });
});
