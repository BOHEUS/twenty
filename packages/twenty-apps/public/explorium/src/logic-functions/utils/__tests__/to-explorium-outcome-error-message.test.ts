import { describe, expect, it } from 'vitest';

import { toExploriumOutcomeErrorMessage } from 'src/logic-functions/utils/to-explorium-outcome-error-message';

describe('toExploriumOutcomeErrorMessage', () => {
  it.each([401, 403])(
    'hides the Explorium message behind the access message on an HTTP %i error',
    (httpStatus) => {
      expect(
        toExploriumOutcomeErrorMessage({
          outcome: 'error',
          httpStatus,
          message: 'Invalid API key',
        }),
      ).toBe(
        'Explorium enrichment is unavailable. Contact your workspace admin.',
      );
    },
  );

  it('keeps the Explorium message for any other error', () => {
    expect(
      toExploriumOutcomeErrorMessage({
        outcome: 'error',
        httpStatus: 429,
        message: 'Rate limited',
      }),
    ).toBe('Rate limited');
  });

  it('reports a missing outcome', () => {
    expect(toExploriumOutcomeErrorMessage(undefined)).toBe(
      'Explorium returned no response for this record.',
    );
  });
});
