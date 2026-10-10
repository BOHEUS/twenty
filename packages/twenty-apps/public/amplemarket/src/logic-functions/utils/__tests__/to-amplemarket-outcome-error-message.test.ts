import { describe, expect, it } from 'vitest';

import { toAmplemarketOutcomeErrorMessage } from 'src/logic-functions/utils/to-amplemarket-outcome-error-message';

describe('toAmplemarketOutcomeErrorMessage', () => {
  it.each([401, 402])(
    'hides the Amplemarket message behind the access message on an HTTP %i error',
    (httpStatus) => {
      expect(
        toAmplemarketOutcomeErrorMessage({
          outcome: 'error',
          httpStatus,
          message: 'Invalid API key',
        }),
      ).toBe(
        'Amplemarket enrichment is unavailable. Contact your workspace admin.',
      );
    },
  );

  it('keeps the Amplemarket message for any other error', () => {
    expect(
      toAmplemarketOutcomeErrorMessage({
        outcome: 'error',
        httpStatus: 403,
        message: 'Rate limited',
      }),
    ).toBe('Rate limited');
  });

  it('reports a missing outcome', () => {
    expect(toAmplemarketOutcomeErrorMessage(undefined)).toBe(
      'Amplemarket returned no response for this record.',
    );
  });
});
