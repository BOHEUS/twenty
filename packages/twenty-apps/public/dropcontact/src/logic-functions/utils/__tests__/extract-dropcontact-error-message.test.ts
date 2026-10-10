import { describe, expect, it } from 'vitest';

import { extractDropcontactErrorMessage } from 'src/logic-functions/utils/extract-dropcontact-error-message';

describe('extractDropcontactErrorMessage', () => {
  it('reads the reason Dropcontact sends with an error', () => {
    expect(
      extractDropcontactErrorMessage({
        json: { error: true, reason: 'API call Token exceeded quota.' },
        httpStatus: 403,
      }),
    ).toBe('API call Token exceeded quota.');
  });

  it('falls back to a generic message when none is present', () => {
    expect(
      extractDropcontactErrorMessage({
        json: { error: true },
        httpStatus: 503,
      }),
    ).toBe('Dropcontact request failed (HTTP 503).');
  });
});
