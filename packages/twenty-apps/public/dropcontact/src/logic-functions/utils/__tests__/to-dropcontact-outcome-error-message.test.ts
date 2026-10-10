import { describe, expect, it } from 'vitest';

import { toDropcontactOutcomeErrorMessage } from 'src/logic-functions/utils/to-dropcontact-outcome-error-message';

describe('toDropcontactOutcomeErrorMessage', () => {
  it.each([401, 403])(
    'hides the Dropcontact message behind the access message on an HTTP %i error',
    (httpStatus) => {
      expect(
        toDropcontactOutcomeErrorMessage({
          outcome: 'error',
          httpStatus,
          message: 'Invalid API key',
        }),
      ).toBe(
        'Dropcontact enrichment is unavailable. Contact your workspace admin.',
      );
    },
  );

  it('keeps the Dropcontact message for any other error', () => {
    expect(
      toDropcontactOutcomeErrorMessage({
        outcome: 'error',
        httpStatus: 429,
        message: 'Rate limited',
      }),
    ).toBe('Rate limited');
  });

  it('reports a missing outcome', () => {
    expect(toDropcontactOutcomeErrorMessage(undefined)).toBe(
      'Dropcontact returned no response for this record.',
    );
  });
});
