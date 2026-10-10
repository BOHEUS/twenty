import { describe, expect, it } from 'vitest';

import { extractExploriumErrorMessage } from 'src/logic-functions/utils/extract-explorium-error-message';

describe('extractExploriumErrorMessage', () => {
  it('reads the details message of a standard error', () => {
    expect(
      extractExploriumErrorMessage({
        json: { details: 'Invalid API key', correlation_id: 'c1' },
        httpStatus: 401,
      }),
    ).toBe('Invalid API key');
  });

  it('joins the messages of a validation error', () => {
    expect(
      extractExploriumErrorMessage({
        json: {
          detail: [
            { loc: ['body', 'prospect_ids'], msg: 'field required' },
            { loc: ['body'], msg: 'extra fields not permitted' },
          ],
        },
        httpStatus: 422,
      }),
    ).toBe('field required; extra fields not permitted');
  });

  it('falls back to a generic message when none is present', () => {
    expect(extractExploriumErrorMessage({ json: {}, httpStatus: 503 })).toBe(
      'Explorium request failed (HTTP 503).',
    );
  });
});
