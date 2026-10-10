import { describe, expect, it } from 'vitest';

import { isSnovAccountErrorOutcome } from 'src/logic-functions/utils/is-snov-account-error-outcome';

describe('isSnovAccountErrorOutcome', () => {
  it.each([401, 403])('flags an HTTP %i error', (httpStatus) => {
    expect(
      isSnovAccountErrorOutcome({
        outcome: 'error',
        httpStatus,
        message: 'rejected',
      }),
    ).toBe(true);
  });

  it.each([429, 500])('does not flag an HTTP %i error', (httpStatus) => {
    expect(
      isSnovAccountErrorOutcome({
        outcome: 'error',
        httpStatus,
        message: 'boom',
      }),
    ).toBe(false);
  });

  it('does not flag a matched outcome', () => {
    expect(
      isSnovAccountErrorOutcome({
        outcome: 'matched',
        data: { id: 'a' },
      }),
    ).toBe(false);
  });

  it('does not flag a missing outcome', () => {
    expect(isSnovAccountErrorOutcome(undefined)).toBe(false);
  });
});
