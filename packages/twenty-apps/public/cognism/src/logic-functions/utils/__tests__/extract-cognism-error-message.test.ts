import { describe, expect, it } from 'vitest';

import { extractCognismErrorMessage } from 'src/logic-functions/utils/extract-cognism-error-message';

describe('extractCognismErrorMessage', () => {
  it('reads the nested Cognism error message', () => {
    expect(
      extractCognismErrorMessage({
        json: { error: { message: 'boom' } },
        httpStatus: 500,
      }),
    ).toBe('boom');
  });

  it('falls back to a generic message when none is present', () => {
    expect(extractCognismErrorMessage({ json: {}, httpStatus: 503 })).toBe(
      'Cognism request failed (HTTP 503).',
    );
  });
});
