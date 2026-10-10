import { describe, expect, it } from 'vitest';

import { extractSnovErrorMessage } from 'src/logic-functions/utils/extract-snov-error-message';

describe('extractSnovErrorMessage', () => {
  it('reads the errors message Snov.io sends', () => {
    expect(
      extractSnovErrorMessage({
        json: { success: false, errors: 'Invalid API key' },
        httpStatus: 401,
      }),
    ).toBe('Invalid API key');
  });

  it('joins a list of errors', () => {
    expect(
      extractSnovErrorMessage({
        json: { success: false, errors: ['Invalid domain', 'Limit reached'] },
        httpStatus: 422,
      }),
    ).toBe('Invalid domain; Limit reached');
  });

  it('falls back to a generic message when none is present', () => {
    expect(extractSnovErrorMessage({ json: {}, httpStatus: 503 })).toBe(
      'Snov.io request failed (HTTP 503).',
    );
  });
});
