import { describe, expect, it } from 'vitest';

import { isAmplemarketAccountErrorOutcome } from 'src/logic-functions/utils/is-amplemarket-account-error-outcome';

describe('isAmplemarketAccountErrorOutcome', () => {
  it.each([401, 402])('flags an HTTP %i error', (httpStatus) => {
    expect(
      isAmplemarketAccountErrorOutcome({
        outcome: 'error',
        httpStatus,
        message: 'rejected',
      }),
    ).toBe(true);
  });

  it.each([403, 500])('does not flag an HTTP %i error', (httpStatus) => {
    expect(
      isAmplemarketAccountErrorOutcome({
        outcome: 'error',
        httpStatus,
        message: 'boom',
      }),
    ).toBe(false);
  });

  it('does not flag a matched outcome', () => {
    expect(
      isAmplemarketAccountErrorOutcome({
        outcome: 'matched',
        data: { id: 'a' },
      }),
    ).toBe(false);
  });

  it('does not flag a missing outcome', () => {
    expect(isAmplemarketAccountErrorOutcome(undefined)).toBe(false);
  });
});
