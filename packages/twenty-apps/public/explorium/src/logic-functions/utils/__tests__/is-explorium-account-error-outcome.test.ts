import { describe, expect, it } from 'vitest';

import { isExploriumAccountErrorOutcome } from 'src/logic-functions/utils/is-explorium-account-error-outcome';

describe('isExploriumAccountErrorOutcome', () => {
  it.each([401, 403])('flags an HTTP %i error', (httpStatus) => {
    expect(
      isExploriumAccountErrorOutcome({
        outcome: 'error',
        httpStatus,
        message: 'rejected',
      }),
    ).toBe(true);
  });

  it.each([429, 500])('does not flag an HTTP %i error', (httpStatus) => {
    expect(
      isExploriumAccountErrorOutcome({
        outcome: 'error',
        httpStatus,
        message: 'boom',
      }),
    ).toBe(false);
  });

  it('does not flag a matched outcome', () => {
    expect(
      isExploriumAccountErrorOutcome({
        outcome: 'matched',
        data: { id: 'a' },
      }),
    ).toBe(false);
  });

  it('does not flag a missing outcome', () => {
    expect(isExploriumAccountErrorOutcome(undefined)).toBe(false);
  });
});
