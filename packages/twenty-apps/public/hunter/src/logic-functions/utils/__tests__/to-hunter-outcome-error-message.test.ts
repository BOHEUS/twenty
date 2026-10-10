import { describe, expect, it } from 'vitest';

import { toHunterOutcomeErrorMessage } from 'src/logic-functions/utils/to-hunter-outcome-error-message';

describe('toHunterOutcomeErrorMessage', () => {
  it.each([401, 429])(
    'hides the Hunter message behind the access message on an HTTP %i error',
    (httpStatus) => {
      expect(
        toHunterOutcomeErrorMessage({
          outcome: 'error',
          httpStatus,
          message: 'Invalid API key',
        }),
      ).toBe('Hunter enrichment is unavailable. Contact your workspace admin.');
    },
  );

  it('keeps the Hunter message for any other error', () => {
    expect(
      toHunterOutcomeErrorMessage({
        outcome: 'error',
        httpStatus: 403,
        message: 'Rate limited',
      }),
    ).toBe('Rate limited');
  });

  it('reports a missing outcome', () => {
    expect(toHunterOutcomeErrorMessage(undefined)).toBe(
      'Hunter returned no response for this record.',
    );
  });
});
