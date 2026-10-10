import { describe, expect, it } from 'vitest';

import { toSnovOutcomeErrorMessage } from 'src/logic-functions/utils/to-snov-outcome-error-message';

describe('toSnovOutcomeErrorMessage', () => {
  it.each([401, 403])(
    'hides the Snov.io message behind the access message on an HTTP %i error',
    (httpStatus) => {
      expect(
        toSnovOutcomeErrorMessage({
          outcome: 'error',
          httpStatus,
          message: 'Invalid API key',
        }),
      ).toBe(
        'Snov.io enrichment is unavailable. Contact your workspace admin.',
      );
    },
  );

  it('keeps the Snov.io message for any other error', () => {
    expect(
      toSnovOutcomeErrorMessage({
        outcome: 'error',
        httpStatus: 429,
        message: 'Rate limited',
      }),
    ).toBe('Rate limited');
  });

  it('reports a missing outcome', () => {
    expect(toSnovOutcomeErrorMessage(undefined)).toBe(
      'Snov.io returned no response for this record.',
    );
  });
});
