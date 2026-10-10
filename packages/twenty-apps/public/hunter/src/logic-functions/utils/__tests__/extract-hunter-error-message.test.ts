import { describe, expect, it } from 'vitest';

import { extractHunterErrorMessage } from 'src/logic-functions/utils/extract-hunter-error-message';

describe('extractHunterErrorMessage', () => {
  it('joins the details of every error Hunter returns', () => {
    expect(
      extractHunterErrorMessage({
        json: {
          errors: [
            { id: 'wrong_params', code: 400, details: 'Missing domain' },
            { id: 'wrong_params', code: 400, details: 'Missing last_name' },
          ],
        },
        httpStatus: 400,
      }),
    ).toBe('Missing domain; Missing last_name');
  });

  it('falls back to a generic message when none is present', () => {
    expect(extractHunterErrorMessage({ json: {}, httpStatus: 503 })).toBe(
      'Hunter request failed (HTTP 503).',
    );
  });
});
