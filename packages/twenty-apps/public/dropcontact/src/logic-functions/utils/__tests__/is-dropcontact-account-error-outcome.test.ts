import { describe, expect, it } from 'vitest';

import { isDropcontactAccountErrorOutcome } from 'src/logic-functions/utils/is-dropcontact-account-error-outcome';

describe('isDropcontactAccountErrorOutcome', () => {
  it.each([401, 403])('flags an HTTP %i error', (httpStatus) => {
    expect(
      isDropcontactAccountErrorOutcome({
        outcome: 'error',
        httpStatus,
        message: 'rejected',
      }),
    ).toBe(true);
  });

  it.each([429, 500])('does not flag an HTTP %i error', (httpStatus) => {
    expect(
      isDropcontactAccountErrorOutcome({
        outcome: 'error',
        httpStatus,
        message: 'boom',
      }),
    ).toBe(false);
  });

  it('does not flag a matched outcome', () => {
    expect(
      isDropcontactAccountErrorOutcome({
        outcome: 'matched',
        data: { id: 'a' },
      }),
    ).toBe(false);
  });

  it('does not flag a missing outcome', () => {
    expect(isDropcontactAccountErrorOutcome(undefined)).toBe(false);
  });
});
